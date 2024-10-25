import { useState } from 'react'
import {
	btc,
	toTxOutpoint,
	getDummySigner,
	getDummyUTXO,
	toTokenAddress,
	getTokenContractP2TR,
	toP2tr,
	getRawTransaction,
	TokenMetadata,
	CHANGE_MIN_POSTAGE,
	Postage,
	TokenContract,
	parseTokens,
	parseTokenMetadata
} from '@/lib/scrypt/common'
import { int2ByteString, MethodCallOptions, toByteString, UTXO, fill, PubKey } from 'scrypt-ts'
import { BurnGuard, TransferGuard, CAT20 } from '@/lib/scrypt/contracts/dist'
import { CatTx } from '@/lib/scrypt/contracts/dist/lib/catTx'
import {
	emptyTokenArray,
	getBackTraceInfo,
	CAT20Proto,
	getTxHeaderCheck,
	getTxCtxMulti,
	PreTxStatesInfo,
	GuardInfo,
	ChangeInfo,
	MAX_TOKEN_OUTPUT
} from '@cat-protocol/cat-smartcontracts'
import { WalletService } from '@/lib/scrypt/providers/unisatWalletService'
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'
import { TokenData } from '@/hooks/use-token'
import { useTokenUtxos } from '@/hooks/use-token-utxos'
import { FXPCat20Sell } from '@/lib/scrypt/contracts/dist'
import { createGuardContract, hydrateTokens } from './use-transfer'
import { OrderbookEntry, getTokenUtxo } from './use-token-orderbook'
import { createGuardAndSellContract } from './use-sell'
import { unlockTaprootContractInput, createTakeSellContract } from './use-take-sell'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const FXPCAT20SellArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPCat20Sell.json')
FXPCat20Sell.loadArtifact(FXPCAT20SellArtifact)

const DEFAULTS = {
	verify: false
}

export async function takeToken(
	wallet: WalletService,
	feeUtxos: UTXO[],
	feeRate: number,
	metadata: TokenMetadata,
	tokens: TokenContract[],
	changeAddress: btc.Address,
	receiver: btc.Address,
	amount: bigint,
	price: bigint,
	cachedTxs: Map<string, btc.Transaction>,
	selectedOrder: OrderbookEntry
): Promise<{
	commitTx: btc.Transaction
	revealTx: btc.Transaction
} | null> {
	if (tokens.length === 0) {
		console.warn('Insufficient token balance!')
		return null
	}

	const sellRawTransaction = await getRawTransaction(
		selectedOrder.genesisTxid || selectedOrder.txid
	)
	const sellContractTx = new btc.Transaction(sellRawTransaction)
	const sellContractUtxoIndex = selectedOrder.genesisOutputIndex || selectedOrder.outputIndex

	let sellContractUtxo = {
		txId: selectedOrder.txid,
		outputIndex: sellContractUtxoIndex,
		script: sellContractTx.outputs[sellContractUtxoIndex].script.toHex(),
		satoshis: sellContractTx.outputs[sellContractUtxoIndex].satoshis
	}

	const sellerLockingScript = `5120${selectedOrder.ownerPubKey}`

	const minterP2TR = toP2tr(metadata.minterAddr)
	const { p2tr: tokenP2TR, tapScript: tokenTapScript } = getTokenContractP2TR(minterP2TR)
	const sellContract = await createTakeSellContract(tokens[0], sellerLockingScript, price)

	if (sellContract.lockingScriptHex !== sellContractUtxo.script) {
		console.log(sellContract.lockingScriptHex, sellContractUtxo.script)
		throw new Error('There was an error creating the sell contract')
	}

	const costEstimate = 10000
	let totalInputValue = 0n
	const usedFeeUtxos: UTXO[] = []

	for (let i = 0; i < feeUtxos.length; i++) {
		const feeUtxo = feeUtxos[i]
		usedFeeUtxos.push(feeUtxo)
		totalInputValue += BigInt(feeUtxo.satoshis)

		if (totalInputValue >= BigInt(costEstimate)) {
			break
		}
	}

	// If we still don't have enough, throw an error
	if (totalInputValue < BigInt(costEstimate)) {
		throw new Error('Insufficient balance to cover the transaction cost')
	}

	let guard

	if (selectedOrder.status === 'partially_open') {
		guard = await createGuardAndSellContract(
			wallet,
			usedFeeUtxos,
			feeRate,
			tokens,
			tokenP2TR,
			changeAddress,
			price
		)

		if (!guard) {
			return null
		}

		sellContractUtxo = {
			txId: guard.catTx.tx.id,
			outputIndex: 2,
			script: guard.catTx.tx.outputs[2].script.toHex(),
			satoshis: guard.catTx.tx.outputs[2].satoshis
		}
	}

	if (selectedOrder.status === 'open') {
		guard = await createGuardContract(
			wallet,
			usedFeeUtxos,
			feeRate,
			tokens,
			tokenP2TR,
			changeAddress
		)
	}

	if (!guard || guard === null) {
		return null
	}

	const tokenInputAmount = tokens.reduce((acc, t) => acc + t.state.data.amount, 0n)
	const guardCommitTxHeader = getTxHeaderCheck(guard.catTx.tx, guard.guardContract.utxo.outputIndex)

	const sellInputIndex = tokens.length + 1
	const guardInputIndex = tokens.length

	const guardInfo: GuardInfo = {
		outputIndex: toTxOutpoint(guard.guardContract.utxo.txId, guard.guardContract.utxo.outputIndex)
			.outputIndex,
		inputIndexVal: BigInt(guardInputIndex),
		tx: guardCommitTxHeader.tx,
		guardState: guard.guardContract.state.data
	}

	if (tokenInputAmount != amount) {
		throw new Error('tokenInputAmount != amount')
	}

	const newFeeUtxo = {
		txId: guard.catTx.tx.id,
		outputIndex: guard.catTx.tx.outputs.length - 1,
		script: guard.catTx.tx.outputs[guard.catTx.tx.outputs.length - 1].script.toHex(),
		satoshis: guard.catTx.tx.outputs[guard.catTx.tx.outputs.length - 1].satoshis
	}

	console.log('tokenP2TR', tokenP2TR)
	console.log('utxo', tokens[0].utxo.script)

	const inputUtxos = [
		...tokens.map(t => t.utxo),
		guard.guardContract.utxo,
		sellContractUtxo,
		newFeeUtxo
	]

	const catTx = CatTx.create()
	catTx.tx.from(inputUtxos)

	const receivers = [CAT20Proto.create(amount, toTokenAddress(receiver))]
	for (const receiver of receivers) {
		catTx.addStateContractOutput(tokenP2TR, CAT20Proto.toByteString(receiver))
	}

	catTx.tx
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: btc.Script.fromAddress(changeAddress)
			})
		)
		.feePerByte(feeRate)

	const { inputTokens, tokenTxs } = await hydrateTokens(tokens, metadata, cachedTxs)

	const vsize = 3394

	const satoshiChangeAmount = catTx.tx.inputAmount - vsize * feeRate - Postage.TOKEN_POSTAGE

	if (satoshiChangeAmount <= CHANGE_MIN_POSTAGE) {
		console.error('Insufficient satoshis balance!')
		return null
	}

	const satoshiChangeOutputIndex = catTx.tx.outputs.length - 1
	const changeInfo: ChangeInfo = {
		script: toByteString(btc.Script.fromAddress(changeAddress).toHex()),
		satoshis: int2ByteString(BigInt(satoshiChangeAmount), 8n)
	}

	// update change amount
	catTx.tx.outputs[satoshiChangeOutputIndex].satoshis = satoshiChangeAmount

	// call getTxCtxMulti
	const inputIndexList: number[] = []
	const scriptBuffers: Buffer[] = []
	for (let i = 0; i < tokens.length; i++) {
		inputIndexList.push(i)
		scriptBuffers.push(Buffer.from(tokenTapScript, 'hex'))
	}
	// push guard
	inputIndexList.push(guardInputIndex)
	scriptBuffers.push(guard.contractTaproot.tapleafBuffer)
	// push sell
	inputIndexList.push(sellInputIndex)
	scriptBuffers.push(sellContract.tapleafBuffer)
	const ctxList = getTxCtxMulti(catTx.tx, inputIndexList, scriptBuffers)

	const sign = async (sigs: string[]) => {
		// token unlock
		for (let i = 0; i < inputTokens.length; i++) {
			const inputToken = inputTokens[i]

			if (inputToken === null) {
				throw new Error('tokenTx null')
			}

			const token = tokens[i]
			const { shPreimage, prevoutsCtx, spentScripts } = ctxList[i]
			const preTx = inputToken.catTx.tx
			const prePreTx = inputToken.preCatTx?.tx
			const backtraceInfo = getBackTraceInfo(preTx, prePreTx, tokenTxs[i]?.prevTokenInputIndex ?? 0)

			const preTxState: PreTxStatesInfo = {
				statesHashRoot: token.state.protocolState.hashRoot,
				txoStateHashes: token.state.protocolState.stateHashList
			}

			await inputToken.contract.connect(getDummySigner())
			const tokenCall = await inputToken.contract.methods.unlock(
				{
					isUserSpend: false,
					userPubKeyPrefix: toByteString(''),
					userPubKey: toByteString(''),
					userSig: toByteString(''),
					contractInputIndex: BigInt(sellInputIndex)
				},
				inputToken.state,
				preTxState,
				guardInfo,
				backtraceInfo,
				shPreimage,
				prevoutsCtx,
				spentScripts,
				{
					fromUTXO: getDummyUTXO(),
					verify: false,
					exec: false
				} as MethodCallOptions<CAT20>
			)
			unlockTaprootContractInput(
				tokenCall,
				inputToken.contractTaproot,
				catTx.tx,
				preTx,
				i,
				DEFAULTS.verify,
				true
			)
		}

		// guard unlock
		{
			const { shPreimage, prevoutsCtx, spentScripts } = ctxList[guardInputIndex]
			const preTx = getTxHeaderCheck(guard.catTx.tx, 1)
			await guard.contract.connect(getDummySigner())
			const tokenOutputMaskArray = fill(false, MAX_TOKEN_OUTPUT)
			const tokenAmountArray = fill(0n, MAX_TOKEN_OUTPUT)
			const mixArray = emptyTokenArray()
			const outputSatoshiArray = emptyTokenArray()
			for (let i = 0; i < receivers.length; i++) {
				const receiver = receivers[i]
				tokenOutputMaskArray[i] = true
				tokenAmountArray[i] = receiver.amount
				mixArray[i] = receiver.ownerAddr
			}
			// other output
			for (let index = receivers.length + 1; index < catTx.tx.outputs.length; index++) {
				const output = catTx.tx.outputs[index]
				mixArray[index - 1] = output.script.toBuffer().toString('hex')
				outputSatoshiArray[index - 1] = int2ByteString(BigInt(output.satoshis), 8n)
			}

			const tokenTransferCheckCall = await guard.contract.methods.transfer(
				catTx.state.stateHashList,
				mixArray,
				tokenAmountArray,
				tokenOutputMaskArray,
				outputSatoshiArray,
				toByteString('4a01000000000000'),
				guard.guardContract.state.data,
				preTx.tx,
				shPreimage,
				prevoutsCtx,
				spentScripts,
				{
					fromUTXO: getDummyUTXO(),
					verify: false,
					exec: false
				} as MethodCallOptions<TransferGuard>
			)
			unlockTaprootContractInput(
				tokenTransferCheckCall,
				guard.contractTaproot,
				catTx.tx,
				guard.catTx.tx,
				guardInputIndex,
				DEFAULTS.verify,
				true
			)
		}
		// sell unlock
		{
			await sellContract.contract.connect(getDummySigner())
			const { shPreimage, prevoutsCtx, spentScripts } = ctxList[sellInputIndex]
			const pubkeyX = await wallet.getXOnlyPublicKey()
			const pubKeyPrefix = await wallet.getPubKeyPrefix()

			const sellCall = await sellContract.contract.methods.take(
				catTx.state.stateHashList,
				0n,
				amount,
				0n,
				toTokenAddress(receiver),
				toByteString('4a01000000000000'),
				false,
				true,
				pubKeyPrefix,
				PubKey(pubkeyX),
				() => sigs[0],
				shPreimage,
				prevoutsCtx,
				spentScripts,
				changeInfo,
				{
					fromUTXO: getDummyUTXO(),
					verify: false,
					exec: false
				} as MethodCallOptions<FXPCat20Sell>
			)
			unlockTaprootContractInput(
				sellCall,
				sellContract,
				catTx.tx,
				sellContractTx,
				sellInputIndex,
				DEFAULTS.verify,
				true
			)
		}
	}

	// const calcVsize = async () => {
	// 	await sign()
	// 	const vsize = catTx.tx.vsize
	// 	resetTx(catTx.tx)
	// 	return vsize
	// }

	// const vsize = await calcVsize()

	const sigs = await wallet.signContract(catTx.tx, sellContract)
	await sign(sigs)

	return {
		revealTx: catTx.tx,
		commitTx: guard.catTx.tx
	}
}

export function useCancelSellCat20(token: TokenData) {
	const [isTransferring, setIsTransferring] = useState(false)
	const { toast } = useToast()
	const { totalAmount } = useTokenUtxos(token)

	const handleCancelSell = async (selectedOrder: OrderbookEntry) => {
		setIsTransferring(true)

		try {
			// Check if Unisat wallet is connected
			if (!window.unisat) {
				toast({
					title: 'Wallet Not Found',
					description: 'Please install the Unisat wallet extension.',
					variant: 'destructive'
				})
				return
			}

			let accounts
			try {
				accounts = await window.unisat.getAccounts()
			} catch (error) {
				if (error instanceof Error && error.message.includes('User rejected the request')) {
					toast({
						title: 'Request Rejected',
						description:
							'You rejected the request to connect your Unisat wallet. Please try again and approve the connection.',
						variant: 'destructive'
					})
				} else {
					toast({
						title: 'Connection Failed',
						description: 'Failed to connect to your Unisat wallet. Please try again.',
						variant: 'destructive'
					})
				}
				return
			}

			if (!accounts.length) {
				toast({
					title: 'Wallet Not Connected',
					description: 'Please connect your Unisat wallet to transfer tokens.',
					variant: 'destructive',
					action: <Button onClick={() => window.unisat.requestAccounts()}>Connect Wallet</Button>
				})
				return
			}

			const scaledAmount = BigInt(selectedOrder.tokenAmount)
			const scaledPrice = BigInt(Number(selectedOrder.price))

			const feeRate = await getFeeRate()
			const bitcoinUtxos = await window.unisat.getBitcoinUtxos()

			if (!bitcoinUtxos || bitcoinUtxos.length === 0) {
				toast({
					title: 'Insufficient Balance',
					description: 'You do not have enough Bitcoin balance to pay for the transaction fee.',
					variant: 'destructive'
				})
				return
			}

			const tokenUtxo = await getTokenUtxo(
				selectedOrder.status === 'partially_open' ? selectedOrder.txid : selectedOrder.tokenTxid,
				selectedOrder.status === 'partially_open'
					? selectedOrder.outputIndex
					: selectedOrder.tokenOutputIndex
			)
			const payload = {
				token: token,
				amount: scaledAmount.toString(),
				feeRate: feeRate,
				publicKey: await window.unisat.getPublicKey(),
				address: (await window.unisat.getAccounts())[0],
				tokenUtxos: [tokenUtxo],
				utxos: bitcoinUtxos.map((utxo: any) => ({
					txId: utxo.txid,
					outputIndex: utxo.vout,
					script: utxo.scriptPk,
					satoshis: utxo.satoshis
				}))
			}

			const wallet = new WalletService()

			const response = await takeToken(
				wallet,
				payload.utxos,
				payload.feeRate,
				parseTokenMetadata(token),
				parseTokens([tokenUtxo]),
				btc.Address.fromString(payload.address),
				btc.Address.fromString(payload.address),
				scaledAmount,
				scaledPrice,
				new Map(),
				selectedOrder
			)

			if (!response) {
				throw new Error('Failed to create PSBT')
			}

			const { commitTx, revealTx } = response

			const commitTxId = await broadcast(commitTx.uncheckedSerialize())

			if (commitTxId instanceof Error) {
				throw new Error(commitTxId.message)
			}

			const revealTxid = await broadcast(revealTx.uncheckedSerialize())

			if (revealTxid instanceof Error) {
				throw new Error(revealTxid.message)
			}
			toast({
				title: 'Transaction Broadcasted!',
				description: 'Your order cancellation is in the mempool',
				action: (
					<Button asChild>
						<a href={`${EXPLORER_URL}/tx/${revealTxid}`} target="_blank" rel="noopener noreferrer">
							View Transaction
						</a>
					</Button>
				)
			})
		} catch (error) {
			console.error('Transfer failed:', error)
			if (error instanceof Error && error.message.includes('User rejected')) {
				toast({
					title: 'Cancelled',
					description: 'You cancelled the request. No tokens were sent.',
					variant: 'destructive'
				})
			} else {
				toast({
					title: 'Transfer Failed',
					description:
						error instanceof Error
							? error.message
							: 'An unexpected error occurred during the transfer.',
					variant: 'destructive'
				})
			}
		} finally {
			setIsTransferring(false)
		}
	}

	return { isTransferring, handleCancelSell, totalAmount }
}
