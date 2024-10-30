import { useState } from 'react'
import {
	btc,
	toTxOutpoint,
	getDummySigner,
	getDummyUTXO,
	getGuardsP2TR,
	getTokenContractP2TR,
	toP2tr,
	getRawTransaction,
	TokenMetadata,
	CHANGE_MIN_POSTAGE,
	Postage,
	TokenContract,
	GuardContract,
	parseTokens,
	parseTokenMetadata
} from '@/lib/scrypt/common'
import {
	int2ByteString,
	MethodCallOptions,
	toByteString,
	UTXO,
	fill,
	hash160,
	ByteString,
	PubKey,
	Sig
} from 'scrypt-ts'
import { BurnGuard, TransferGuard, CAT20 } from '@/lib/scrypt/contracts/dist'
import { TaprootSmartContract, CatTx } from '@/lib/scrypt/contracts/dist/lib/catTx'
import {
	emptyTokenArray,
	getBackTraceInfo,
	CAT20Proto,
	getTxHeaderCheck,
	getTxCtxMulti,
	PreTxStatesInfo,
	GuardInfo,
	ChangeInfo,
	MAX_TOKEN_OUTPUT,
	GuardProto,
	MAX_INPUT,
	TokenUnlockArgs
} from '@cat-protocol/cat-smartcontracts'
import { WalletService } from '@/lib/scrypt/providers/unisatWalletService'
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'
import { TokenData } from '@/hooks/use-token'
import { useTokenUtxos } from '@/hooks/use-token-utxos'
import { FXPCat20Buy, FXPBuyGuard } from '@/lib/scrypt/contracts/dist'
import { SellUtil } from '@/lib/scrypt/contracts/dist/contracts/token/sellUtil'
import { createGuardContract, hydrateTokens } from './use-transfer'
import { OrderbookEntry } from './use-token-orderbook'
import { getGuardContractInfo } from './use-transfer'
import { unlockTaprootContractInput } from './use-take-sell'
import { FXP_SERVICE_FEE, FXP_SERVICE_FEE_P2TR } from '@/lib/constants'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const FXPCAT20BuyArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPCat20Buy.json')
FXPCat20Buy.loadArtifact(FXPCAT20BuyArtifact)

const FXPBuyGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPBuyGuard.json')
FXPBuyGuard.loadArtifact(FXPBuyGuardArtifact)

const DEFAULTS = {
	verify: false
}

export async function createTakeBuyContract(
	tokenP2TR: string,
	seller_locking_script: string,
	price: bigint
) {
	const pkh = new btc.Script(seller_locking_script).getPublicKeyHash().toString('hex')
	return TaprootSmartContract.create(new FXPCat20Buy(tokenP2TR, hash160(pkh), price, false))
}

export async function createGuardAndBuyContract(
	wallet: WalletService,
	feeUtxo: UTXO | UTXO[],
	feeRate: number,
	tokens: TokenContract[],
	tokenP2TR: string,
	changeAddress: btc.Address,
	price: bigint,
	sellerAddress?: btc.Address
) {
	const guardInfo = getGuardContractInfo()
	const walletXOnlyPublicKey = sellerAddress
		? btc.Script.fromAddress(sellerAddress)
				.getPublicKeyHash()
				.toString('hex')
		: await wallet.getXOnlyPublicKey()

	const sellContract = TaprootSmartContract.create(
		new FXPCat20Buy(tokenP2TR, hash160(walletXOnlyPublicKey), price, false)
	)

	const guardState = GuardProto.createEmptyState()
	guardState.tokenScript = tokenP2TR

	for (let i = 0; i < tokens.length; i++) {
		guardState.inputTokenAmountArray[i] = tokens[i].state.data.amount
	}

	const catTx = CatTx.create()
	// catTx.tx.from([orderbook.utxo, newFeeUtxo])
	catTx.tx.from(feeUtxo)
	const atIndex = catTx.addStateContractOutput(
		guardInfo.lockingScript,
		GuardProto.toByteString(guardState),
		Postage.GUARD_POSTAGE
	)

	catTx.addContractOutput(sellContract.lockingScriptHex, Postage.TOKEN_POSTAGE)
	catTx.tx.change(changeAddress).feePerByte(feeRate)
	// Disables tx locktime
	catTx.tx.inputs.forEach((i: any) => {
		i.sequenceNumber = 0xffffffff
	})
	catTx.tx.nLockTime = Number(price)

	const { tapScript: guardTapScript } = getGuardsP2TR()

	if (catTx.tx.getChangeOutput() === null) {
		console.error('Insufficient satoshis balance!')
		return null
	}

	await wallet.signFeeInput(catTx.tx)

	const guardContract: GuardContract = {
		utxo: {
			txId: catTx.tx.id,
			outputIndex: atIndex,
			script: catTx.tx.outputs[atIndex].script.toHex(),
			satoshis: catTx.tx.outputs[atIndex].satoshis
		},
		state: {
			protocolState: catTx.state,
			data: guardState
		}
	}

	return {
		commitTx: catTx.tx,
		catTx: catTx,
		contract: guardInfo.contractTaprootMap.transfer.contract,
		contractTaproot: guardInfo.contractTaprootMap.transfer,
		atOutputIndex: atIndex,
		guardContract,
		sellContract,
		guardTapScript
	}
}

export async function takeToken(
	wallet: WalletService,
	feeUtxos: UTXO[],
	feeRate: number,
	metadata: TokenMetadata,
	tokens: TokenContract[],
	changeAddress: btc.Address,
	amount: bigint,
	price: bigint,
	cachedTxs: Map<string, btc.Transaction>,
	selectedOrder: OrderbookEntry
): Promise<{
	commitTx: btc.Transaction
	revealTx: btc.Transaction
} | null> {
	console.log({ selectedOrder })
	if (tokens.length === 0) {
		console.warn('Insufficient token balance!')
		return null
	}

	const buyRawTransaction = await getRawTransaction(selectedOrder.txid)
	const buyContractTx = new btc.Transaction(buyRawTransaction)
	const buyContractUtxoIndex = selectedOrder.outputIndex

	console.log('buyContractUtxoIndex', buyContractUtxoIndex)

	const buyContractUtxo = {
		txId: selectedOrder.txid,
		outputIndex: buyContractUtxoIndex,
		script: buyContractTx.outputs[buyContractUtxoIndex].script.toHex(),
		satoshis: buyContractTx.outputs[buyContractUtxoIndex].satoshis
	}

	const costSats = amount * price
	const remainingSats = BigInt(buyContractUtxo.satoshis) - BigInt(costSats)
	const sellerLockingScript = `5120${selectedOrder.ownerPubKey}`

	const minterP2TR = toP2tr(metadata.minterAddr)
	const { p2tr: tokenP2TR, tapScript: tokenTapScript } = getTokenContractP2TR(minterP2TR)
	const buyContract = await createTakeBuyContract(tokenP2TR, sellerLockingScript, price)

	if (buyContract.lockingScriptHex !== buyContractUtxo.script) {
		console.log(buyContract.lockingScriptHex, buyContractUtxo.script)
		throw new Error('There was an error creating the sell contract')
	}

	const guard = await createGuardContract(
		wallet,
		[feeUtxos[0]],
		feeRate,
		tokens,
		tokenP2TR,
		changeAddress,
		{ networkFee: false }
	)

	if (!guard || guard === null) {
		return null
	}

	const tokenInputAmount = tokens.reduce((acc, t) => acc + t.state.data.amount, 0n)
	const changeTokenInputAmount = tokenInputAmount - amount
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

	const inputUtxos = [...tokens.map(t => t.utxo), guard.guardContract.utxo, buyContractUtxo]

	const catTx = CatTx.create()
	catTx.tx.from(inputUtxos)

	const receivers = [CAT20Proto.create(amount, hash160(selectedOrder.ownerPubKey))]

	const xOnlyPubKey = await wallet.getXOnlyPublicKey()
	if (changeTokenInputAmount > 0n) {
		const tokenChange = CAT20Proto.create(changeTokenInputAmount, hash160(xOnlyPubKey))
		receivers.push(tokenChange)
	}

	for (const receiver of receivers) {
		catTx.addStateContractOutput(tokenP2TR, CAT20Proto.toByteString(receiver))
	}

	if (remainingSats > 0n) {
		// add change output for contract
		catTx.addContractOutput(buyContract.lockingScriptHex, Number(remainingSats))

		if (remainingSats <= 330n) {
			throw new Error('Remaining sats would be below the dust limit')
		}
	}

	// Service Fee
	catTx.addContractOutput(FXP_SERVICE_FEE_P2TR, Number(FXP_SERVICE_FEE))

	// FXPBuyGuard - only if the order is complete
	if (remainingSats == 0n) {
		const fxpBuyGuard = TaprootSmartContract.create(new FXPBuyGuard())
		catTx.addContractOutput(fxpBuyGuard.lockingScriptHex)
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

	let vsize = 4224
	let satoshiChangeAmount =
		catTx.tx.inputAmount -
		vsize * feeRate -
		Postage.TOKEN_POSTAGE -
		Postage.TOKEN_POSTAGE -
		Postage.TOKEN_POSTAGE -
		Number(FXP_SERVICE_FEE) -
		Postage.GUARD_POSTAGE -
		Number(remainingSats)

	if (satoshiChangeAmount <= CHANGE_MIN_POSTAGE) {
		const newFeeUtxo = {
			txId: guard.catTx.tx.id,
			outputIndex: guard.catTx.tx.outputs.length - 1,
			script: guard.catTx.tx.outputs[guard.catTx.tx.outputs.length - 1].script.toHex(),
			satoshis: guard.catTx.tx.outputs[guard.catTx.tx.outputs.length - 1].satoshis
		}

		catTx.tx.from(newFeeUtxo)
		vsize = 4312
		satoshiChangeAmount =
			catTx.tx.inputAmount -
			vsize * feeRate -
			Postage.TOKEN_POSTAGE -
			Postage.TOKEN_POSTAGE -
			Postage.GUARD_POSTAGE -
			Postage.TOKEN_POSTAGE -
			Number(FXP_SERVICE_FEE) -
			Number(remainingSats)
		if (satoshiChangeAmount <= CHANGE_MIN_POSTAGE) {
			console.error('Insufficient satoshis balance!')
			return null
		}
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
	scriptBuffers.push(buyContract.tapleafBuffer)
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

			const sig = sigs[i]
			const pubkeyX = await wallet.getXOnlyPublicKey()
			const pubKeyPrefix = await wallet.getPubKeyPrefix()
			const tokenUnlockArgs: TokenUnlockArgs = {
				isUserSpend: true,
				userPubKeyPrefix: pubKeyPrefix,
				userPubKey: PubKey(pubkeyX),
				userSig: Sig(sig),
				contractInputIndex: BigInt(i)
			}

			await inputToken.contract.connect(getDummySigner())
			const tokenCall = await inputToken.contract.methods.unlock(
				tokenUnlockArgs,
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
			const spendAmountCtx: ByteString[] = []
			catTx.tx.inputs.forEach((input: any) => {
				spendAmountCtx.push(SellUtil.int32ToSatoshiBytes(input.output.satoshis))
			})
			for (let i = 0; i < MAX_INPUT; i++) {
				if (typeof spendAmountCtx[i] === 'undefined') {
					spendAmountCtx.push(toByteString(''))
				}
			}

			await buyContract.contract.connect(getDummySigner())
			const { shPreimage, prevoutsCtx, spentScripts } = ctxList[sellInputIndex]
			const sellCall = await buyContract.contract.methods.take(
				catTx.state.stateHashList,
				BigInt(selectedOrder.tokenAmount),
				amount,
				changeTokenInputAmount,
				hash160(xOnlyPubKey),
				toByteString('4a01000000000000'),
				0n,
				true,
				false,
				toByteString(''),
				toByteString(''),
				() => toByteString(''),
				shPreimage,
				prevoutsCtx,
				spentScripts,
				spendAmountCtx,
				changeInfo,
				{
					fromUTXO: getDummyUTXO(),
					verify: false,
					exec: false
				} as MethodCallOptions<FXPCat20Buy>
			)
			unlockTaprootContractInput(
				sellCall,
				buyContract,
				catTx.tx,
				buyContractTx,
				sellInputIndex,
				DEFAULTS.verify,
				true
			)
		}
	}

	const sigs = await wallet.signToken(catTx.tx, metadata)
	await sign(sigs)

	console.log('actual reveal', catTx.tx.vsize, 'estimated vsize', vsize)

	if (Math.abs(Number(catTx.tx.vsize - vsize)) > 10) {
		debugger
	}

	return {
		revealTx: catTx.tx,
		commitTx: guard.catTx.tx
	}
}

export function useTakeBuyCat20(token: TokenData) {
	const [isTransferring, setIsTransferring] = useState(false)
	const { toast } = useToast()
	const { totalAmount, utxos } = useTokenUtxos(token)

	const handleTakeBuy = async (
		transferAmount: string,
		transferAddress: string,
		selectedOrder: OrderbookEntry
	) => {
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

			const transferAmountNumber = Number(transferAmount)
			if (isNaN(transferAmountNumber) || transferAmountNumber <= 0) {
				toast({
					title: 'Invalid Amount',
					description: 'Please enter a valid transfer amount.',
					variant: 'destructive'
				})
				return
			}

			const priceNumber = Number(selectedOrder.price)
			if (isNaN(priceNumber) || priceNumber <= 0) {
				toast({
					title: 'Invalid Price',
					description: 'Please enter a valid price in BTC.',
					variant: 'destructive'
				})
				return
			}

			// Scale the transfer amount by token decimals
			const scaledAmount = BigInt(Math.round(transferAmountNumber * Math.pow(10, token.decimals)))

			// Scale the price to satoshis
			const scaledPrice = BigInt(priceNumber)

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

			// Select token UTXOs
			const selectedUtxos = []
			let selectedAmount = 0n
			for (const utxo of utxos) {
				if (selectedUtxos.length >= 3) break
				selectedUtxos.push(utxo)
				selectedAmount += BigInt(utxo.state.amount)
				if (selectedAmount >= scaledAmount) break
			}

			if (selectedAmount < scaledAmount) {
				const maxTransferAmount = Number(selectedAmount) / Math.pow(10, token.decimals)
				toast({
					title: 'Insufficient Balance',
					description: `You don't have enough balance or the amount exceeds the maximum for a single transaction. Your current balance allows you to send up to ${maxTransferAmount} ${token.symbol}. Try this amount or less.`,
					variant: 'destructive'
				})
				return
			}

			const payload = {
				token: token,
				amount: scaledAmount.toString(),
				feeRate: feeRate,
				publicKey: await window.unisat.getPublicKey(),
				address: (await window.unisat.getAccounts())[0],
				tokenUtxos: selectedUtxos,
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
				parseTokens(selectedUtxos),
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
				description: 'Your cat20 purchase is in the mempool',
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
					title: 'Transfer Cancelled',
					description: 'You cancelled the transfer request. No tokens were sent.',
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

	return { isTransferring, handleTakeBuy, totalAmount }
}
