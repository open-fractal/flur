import { useState } from 'react'
import {
	btc,
	toTxOutpoint,
	getDummySigner,
	getDummyUTXO,
	callToBufferList,
	toTokenAddress,
	getGuardsP2TR,
	getTokenContractP2TR,
	resetTx,
	toStateScript,
	toP2tr,
	script2P2TR,
	p2tr2Address,
	verifyContract,
	getRawTransaction,
	TokenMetadata,
	CHANGE_MIN_POSTAGE,
	Postage,
	GuardContract,
	TokenContract,
	parseTokens,
	parseTokenMetadata
} from '@/lib/scrypt/common'
import { int2ByteString, MethodCallOptions, toByteString, PubKey, UTXO, fill, Sig } from 'scrypt-ts'
import { BurnGuard, TransferGuard, CAT20 } from '@/lib/scrypt/contracts/dist'
import {
	emptyTokenAmountArray,
	emptyTokenArray,
	getBackTraceInfo,
	ProtocolState,
	GuardProto,
	CAT20Proto,
	CAT20State,
	getTxHeaderCheck,
	getTxCtxMulti,
	TokenUnlockArgs,
	PreTxStatesInfo,
	GuardInfo,
	ChangeInfo,
	MAX_TOKEN_OUTPUT,
	MAX_INPUT
} from '@cat-protocol/cat-smartcontracts'
import { DUMMY_SIG, WalletService } from '@/lib/scrypt/providers/unisatWalletService'
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'
import { TokenData } from '@/hooks/use-token'
import { useTokenUtxos } from '@/hooks/use-token-utxos'
import {
	CatTx,
	ContractIns,
	TaprootMastSmartContract,
	TaprootSmartContract
} from '@cat-protocol/cat-smartcontracts/dist/lib/catTx'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

async function unlockToken(
	wallet: WalletService,
	tokenContract: TokenContract,
	tokenInputIndex: number,
	prevTokenTx: btc.Transaction,
	preTokenInputIndex: number,
	prevPrevTokenTx: btc.Transaction,
	guardInfo: GuardInfo,
	revealTx: btc.Transaction,
	minterP2TR: string,
	txCtx: any,
	sig: string,
	verify: boolean
) {
	const { cblock: cblockToken, contract: token } = getTokenContractP2TR(minterP2TR)

	const { shPreimage, prevoutsCtx, spentScripts } = txCtx

	const pubkeyX = await wallet.getXOnlyPublicKey()
	const pubKeyPrefix = await wallet.getPubKeyPrefix()
	const tokenUnlockArgs: TokenUnlockArgs = {
		isUserSpend: true,
		userPubKeyPrefix: pubKeyPrefix,
		userPubKey: PubKey(pubkeyX),
		userSig: Sig(sig),
		contractInputIndex: 0n
	}
	const backtraceInfo = getBackTraceInfo(prevTokenTx, prevPrevTokenTx, preTokenInputIndex)

	const {
		state: { protocolState, data: preState }
	} = tokenContract

	await token.connect(getDummySigner())
	const preTxState: PreTxStatesInfo = {
		statesHashRoot: protocolState.hashRoot,
		txoStateHashes: protocolState.stateHashList
	}

	const tokenCall = await token.methods.unlock(
		tokenUnlockArgs,
		preState,
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

	console.log('cblockToken', cblockToken)
	const witnesses = [
		...callToBufferList(tokenCall),
		// taproot script + cblock
		token.lockingScript.toBuffer(),
		Buffer.from(cblockToken, 'hex')
	]
	revealTx.inputs[tokenInputIndex].witnesses = witnesses

	if (verify) {
		const res = verifyContract(tokenContract.utxo, revealTx, tokenInputIndex, witnesses)
		if (typeof res === 'string') {
			console.error('unlocking token contract failed!', res)
			return false
		}
		return true
	}

	return true
}

async function unlockGuard(
	guardContract: GuardContract,
	guardInfo: GuardInfo,
	guardInputIndex: number,
	newState: ProtocolState,
	revealTx: btc.Transaction,
	receiverTokenState: CAT20State,
	changeTokenState: null | CAT20State,
	changeInfo: ChangeInfo,
	txCtx: any,
	verify: boolean
) {
	// amount check run verify
	const { shPreimage, prevoutsCtx, spentScripts } = txCtx
	const outputArray = emptyTokenArray()
	const tokenAmountArray = emptyTokenAmountArray()
	const tokenOutputIndexArray = fill(false, MAX_TOKEN_OUTPUT)
	outputArray[0] = receiverTokenState.ownerAddr
	tokenAmountArray[0] = receiverTokenState.amount
	tokenOutputIndexArray[0] = true

	if (changeTokenState) {
		outputArray[1] = changeTokenState.ownerAddr
		tokenAmountArray[1] = changeTokenState.amount
		tokenOutputIndexArray[1] = true
	}

	const satoshiChangeOutputIndex = changeTokenState === null ? 1 : 2

	const { cblock: transferCblock, contract: transferGuard } = getGuardsP2TR()

	await transferGuard.connect(getDummySigner())

	const outpointSatoshiArray = emptyTokenArray()
	outpointSatoshiArray[satoshiChangeOutputIndex] = changeInfo.satoshis
	outputArray[satoshiChangeOutputIndex] = changeInfo.script
	tokenOutputIndexArray[satoshiChangeOutputIndex] = false

	const transferGuardCall = await transferGuard.methods.transfer(
		newState.stateHashList,
		outputArray,
		tokenAmountArray,
		tokenOutputIndexArray,
		outpointSatoshiArray,
		int2ByteString(BigInt(Postage.TOKEN_POSTAGE), 8n),
		guardContract.state.data,
		guardInfo.tx,
		shPreimage,
		prevoutsCtx,
		spentScripts,
		{
			fromUTXO: getDummyUTXO(),
			verify: false,
			exec: false
		} as MethodCallOptions<TransferGuard>
	)
	const witnesses = [
		...callToBufferList(transferGuardCall),
		// taproot script + cblock
		transferGuard.lockingScript.toBuffer(),
		Buffer.from(transferCblock, 'hex')
	]
	revealTx.inputs[guardInputIndex].witnesses = witnesses

	if (verify) {
		const res = verifyContract(guardContract.utxo, revealTx, guardInputIndex, witnesses)
		if (typeof res === 'string') {
			console.error('unlocking guard contract failed!', res)
			return false
		}
		return true
	}
	return true
}

export const getGuardContractInfo = function() {
	const burnGuard = new BurnGuard()
	const transfer = new TransferGuard()
	const contractMap = {
		burn: burnGuard,
		transfer: transfer
	}
	const guardInfo = new TaprootMastSmartContract(contractMap)
	return guardInfo
}

export async function createGuardContract(
	wallet: WalletService,
	feeUtxos: UTXO[],
	feeRate: number,
	tokens: TokenContract[],
	tokenP2TR: string,
	changeAddress: btc.Address,
	options: {
		networkFee: boolean
	} = {
		networkFee: true
	}
) {
	const guardInfo = getGuardContractInfo()

	const guardState = GuardProto.createEmptyState()
	guardState.tokenScript = tokenP2TR

	for (let i = 0; i < tokens.length; i++) {
		guardState.inputTokenAmountArray[i] = tokens[i].state.data.amount
	}

	const catTx = CatTx.create()
	catTx.tx.from(feeUtxos)
	const atIndex = catTx.addStateContractOutput(
		guardInfo.lockingScript,
		GuardProto.toByteString(guardState),
		Postage.GUARD_POSTAGE
	)

	const feeAddress = process.env.NEXT_PUBLIC_FEE_ADDRESS
	const feeSats = process.env.NEXT_PUBLIC_FEE_SATS
		? parseInt(process.env.NEXT_PUBLIC_FEE_SATS)
		: undefined

	if (options.networkFee && feeAddress && feeSats) {
		const { toP2tr } = await import('@/lib/scrypt/common/utils')
		const feeScript = toP2tr(feeAddress)

		catTx.tx.addOutput(
			new btc.Transaction.Output({
				satoshis: feeSats,
				script: feeScript
			})
		)
	}

	catTx.tx.change(changeAddress).feePerByte(feeRate)

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
		catTx: catTx,
		contract: guardInfo.contractTaprootMap.transfer.contract,
		contractTaproot: guardInfo.contractTaprootMap.transfer,
		atOutputIndex: atIndex,
		guardContract
	}
}

export async function hydrateTokens(
	tokens: TokenContract[],
	metadata: TokenMetadata,
	cachedTxs: Map<string, btc.Transaction>
): Promise<{
	inputTokens: ContractIns<CAT20State>[]
	tokenTxs: Array<{
		prevTx: btc.Transaction
		prevTokenInputIndex: number
		prevPrevTx: btc.Transaction
	} | null>
}> {
	const tokenTxs = await fetchTokenTxs(tokens, metadata, cachedTxs)

	const { contract } = getTokenContractP2TR(toP2tr(metadata.minterAddr))

	const inputTokens = tokenTxs.map((tokenTx, index) => {
		if (!tokenTx) {
			throw new Error(`Failed to fetch transaction data for token at index ${index}`)
		}

		const { prevTx, prevPrevTx } = tokenTx
		const token = tokens[index]

		const preCatTx = new CatTx()
		const catTx = new CatTx()

		catTx.tx = prevTx
		preCatTx.tx = prevPrevTx

		const contractIns: ContractIns<CAT20State> = {
			contract,
			state: token.state.data,
			catTx: catTx,
			preCatTx: preCatTx,
			atOutputIndex: token.utxo.outputIndex,
			contractTaproot: new TaprootSmartContract(contract)
		}

		return contractIns
	})

	return { inputTokens, tokenTxs }
}

export async function fetchTokenTxs(
	tokens: TokenContract[],
	metadata: TokenMetadata,
	cachedTxs: Map<string, btc.Transaction>
): Promise<
	Array<{
		prevTx: btc.Transaction
		prevTokenInputIndex: number
		prevPrevTx: btc.Transaction
	} | null>
> {
	return Promise.all(
		tokens.map(async ({ utxo: tokenUtxo }) => {
			let prevTx: btc.Transaction | null = null
			if (cachedTxs.has(tokenUtxo.txId)) {
				prevTx = cachedTxs.get(tokenUtxo.txId)!
			} else {
				const prevTxHex = await getRawTransaction(tokenUtxo.txId)
				if (prevTxHex instanceof Error) {
					console.error(`get raw transaction ${tokenUtxo.txId} failed!`, prevTxHex)
					return null
				}
				prevTx = new btc.Transaction(prevTxHex)
				cachedTxs.set(tokenUtxo.txId, prevTx)
			}

			let prevTokenInputIndex = 0

			const input = prevTx.inputs.find((input: any, inputIndex: number) => {
				const witnesses = input.getWitnesses()

				if (Array.isArray(witnesses) && witnesses.length > 2) {
					const lockingScriptBuffer = witnesses[witnesses.length - 2]
					const { p2tr } = script2P2TR(lockingScriptBuffer)

					const address = p2tr2Address(p2tr, 'fractal-mainnet')
					if (address === metadata.tokenAddr || address === metadata.minterAddr) {
						prevTokenInputIndex = inputIndex
						return true
					}
				}
			})

			if (!input) {
				console.error(`There is no valid preTx of the ftUtxo!`)
				return null
			}

			let prevPrevTx: btc.Transaction | null = null

			const prevPrevTxId = prevTx.inputs[prevTokenInputIndex].prevTxId.toString('hex')

			if (cachedTxs.has(prevPrevTxId)) {
				prevPrevTx = cachedTxs.get(prevPrevTxId)!
			} else {
				const prevPrevTxHex = await getRawTransaction(prevPrevTxId)
				if (prevPrevTxHex instanceof Error) {
					console.error(`get raw transaction ${prevPrevTxId} failed!`, prevPrevTxHex)
					return null
				}
				prevPrevTx = new btc.Transaction(prevPrevTxHex)
				cachedTxs.set(prevPrevTxId, prevPrevTx)
			}

			return {
				prevTx,
				prevTokenInputIndex,
				prevPrevTx
			}
		})
	)
}

export async function sendToken(
	wallet: WalletService,
	feeUtxo: UTXO,
	feeRate: number,
	metadata: TokenMetadata,
	tokens: TokenContract[],
	changeAddress: btc.Address,
	receiver: btc.Address,
	amount: bigint,
	cachedTxs: Map<string, btc.Transaction>
): Promise<{
	commitTx: btc.Transaction
	revealTx: btc.Transaction
	contracts: TokenContract[]
} | null> {
	if (tokens.length === 0) {
		console.warn('Insufficient token balance!')
		return null
	}

	const minterP2TR = toP2tr(metadata.minterAddr)
	const { p2tr: tokenP2TR, tapScript: tokenTapScript } = getTokenContractP2TR(minterP2TR)

	const commitResult = await createGuardContract(
		wallet,
		[feeUtxo],
		feeRate,
		tokens,
		tokenP2TR,
		changeAddress
	)

	if (commitResult === null) {
		return null
	}

	const commitTx = commitResult.catTx.tx
	const guardTapScript = commitResult.contractTaproot.tapleaf
	const guardContract = commitResult.guardContract

	const newState = ProtocolState.getEmptyState()
	const receiverTokenState = CAT20Proto.create(amount, toTokenAddress(receiver))
	newState.updateDataList(0, CAT20Proto.toByteString(receiverTokenState))
	const tokenInputAmount = tokens.reduce((acc, t) => acc + t.state.data.amount, 0n)
	const changeTokenInputAmount = tokenInputAmount - amount
	let changeTokenState: null | CAT20State = null

	if (changeTokenInputAmount > 0n) {
		const tokenChangeAddress = await wallet.getTokenAddress()
		changeTokenState = CAT20Proto.create(changeTokenInputAmount, tokenChangeAddress)
		newState.updateDataList(1, CAT20Proto.toByteString(changeTokenState))
	}

	const newFeeUtxo = {
		txId: commitTx.id,
		outputIndex: commitTx.outputs.length - 1,
		script: commitTx.outputs[commitTx.outputs.length - 1].script.toHex(),
		satoshis: commitTx.outputs[commitTx.outputs.length - 1].satoshis
	}

	const inputUtxos = [...tokens.map(t => t.utxo), guardContract.utxo, newFeeUtxo]

	if (inputUtxos.length > MAX_INPUT) {
		throw new Error('to much input')
	}

	const revealTx = new btc.Transaction()
		.from(inputUtxos)
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: toStateScript(newState)
			})
		)
		.addOutput(
			new btc.Transaction.Output({
				satoshis: Postage.TOKEN_POSTAGE,
				script: tokenP2TR
			})
		)
		.feePerByte(feeRate)

	if (changeTokenState) {
		revealTx.addOutput(
			new btc.Transaction.Output({
				satoshis: Postage.TOKEN_POSTAGE,
				script: tokenP2TR
			})
		)
	}

	const satoshiChangeScript = btc.Script.fromAddress(changeAddress)
	revealTx.addOutput(
		new btc.Transaction.Output({
			satoshis: 0,
			script: satoshiChangeScript
		})
	)

	const tokenTxs = await fetchTokenTxs(tokens, metadata, cachedTxs)

	const success = tokenTxs.every(t => t !== null)

	if (!success) {
		return null
	}

	const guardCommitTxHeader = getTxHeaderCheck(commitTx, guardContract.utxo.outputIndex)

	const guardInputIndex = tokens.length
	const guardInfo: GuardInfo = {
		outputIndex: toTxOutpoint(guardContract.utxo.txId, guardContract.utxo.outputIndex).outputIndex,
		inputIndexVal: BigInt(guardInputIndex),
		tx: guardCommitTxHeader.tx,
		guardState: guardContract.state.data
	}

	const vsize = await calcVsize(
		wallet,
		tokens,
		guardContract,
		revealTx,
		guardInfo,
		tokenTxs as Array<{
			prevTx: btc.Transaction
			prevPrevTx: btc.Transaction
			prevTokenInputIndex: number
		}>,
		tokenTapScript,
		guardTapScript,
		newState,
		receiverTokenState,
		changeTokenState,
		satoshiChangeScript,
		minterP2TR
	)

	const satoshiChangeAmount =
		revealTx.inputAmount -
		vsize * feeRate -
		Postage.TOKEN_POSTAGE -
		(changeTokenState === null ? 0 : Postage.TOKEN_POSTAGE)

	if (satoshiChangeAmount <= CHANGE_MIN_POSTAGE) {
		console.error('Insufficient satoshis balance!')
		return null
	}

	const satoshiChangeOutputIndex = changeTokenState === null ? 2 : 3

	// update change amount
	revealTx.outputs[satoshiChangeOutputIndex].satoshis = satoshiChangeAmount

	const txCtxs = getTxCtxMulti(revealTx, tokens.map((_, i) => i).concat([tokens.length]), [
		...new Array(tokens.length).fill(Buffer.from(tokenTapScript, 'hex')),
		Buffer.from(guardTapScript, 'hex')
	])

	const changeInfo: ChangeInfo = {
		script: toByteString(satoshiChangeScript.toHex()),
		satoshis: int2ByteString(BigInt(satoshiChangeAmount), 8n)
	}

	const verify = false
	console.log('config verify:', verify)

	const sigs = await wallet.signToken(revealTx, metadata)

	for (let i = 0; i < tokens.length; i++) {
		// ignore changeInfo when transfer token
		const tokenTx = tokenTxs[i]

		if (tokenTx === null) {
			throw new Error('tokenTx null')
		}

		const res = await unlockToken(
			wallet,
			tokens[i],
			i,
			tokenTx.prevTx,
			tokenTx.prevTokenInputIndex,
			tokenTx.prevPrevTx,
			guardInfo,
			revealTx,
			minterP2TR,
			txCtxs[i],
			sigs[i],
			verify
		)

		if (!res) {
			return null
		}
	}

	const res = await unlockGuard(
		guardContract,
		guardInfo,
		guardInputIndex,
		newState,
		revealTx,
		receiverTokenState,
		changeTokenState,
		changeInfo,
		txCtxs[guardInputIndex],
		verify
	)

	if (!res) {
		return null
	}

	//await wallet.signFeeInput(revealTx);

	const receiverTokenContract: TokenContract = {
		utxo: {
			txId: revealTx.id,
			outputIndex: 1,
			script: revealTx.outputs[1].script.toHex(),
			satoshis: revealTx.outputs[1].satoshis
		},
		state: {
			protocolState: newState,
			data: receiverTokenState
		}
	}

	const contracts: TokenContract[] = []
	contracts.push(receiverTokenContract)

	if (changeTokenState !== null) {
		const changeTokenContract: TokenContract = {
			utxo: {
				txId: revealTx.id,
				outputIndex: 2,
				script: revealTx.outputs[2].script.toHex(),
				satoshis: revealTx.outputs[2].satoshis
			},
			state: {
				protocolState: newState,
				data: changeTokenState
			}
		}
		contracts.push(changeTokenContract)
	}

	return {
		commitTx,
		revealTx,
		contracts
	}
}

const calcVsize = async (
	wallet: WalletService,
	tokens: TokenContract[],
	guardContract: GuardContract,
	revealTx: btc.Transaction,
	guardInfo: GuardInfo,
	tokenTxs: Array<{
		prevTx: btc.Transaction
		prevPrevTx: btc.Transaction
		prevTokenInputIndex: number
	}>,
	tokenTapScript: string,
	guardTapScript: string,
	newState: ProtocolState,
	receiverTokenState: CAT20State,
	changeTokenState: CAT20State | null,
	satoshisChangeScript: btc.Script,
	minterP2TR: string
) => {
	const txCtxs = getTxCtxMulti(revealTx, tokens.map((_, i) => i).concat([tokens.length]), [
		...new Array(tokens.length).fill(Buffer.from(tokenTapScript, 'hex')),
		Buffer.from(guardTapScript, 'hex')
	])

	const guardInputIndex = tokens.length

	const changeInfo: ChangeInfo = {
		script: satoshisChangeScript.toHex(),
		satoshis: int2ByteString(0n, 8n)
	}

	const sigs = new Array(tokens.length).fill(DUMMY_SIG)
	for (let i = 0; i < tokens.length; i++) {
		await unlockToken(
			wallet,
			tokens[i],
			i,
			tokenTxs[i].prevTx,
			tokenTxs[i].prevTokenInputIndex,
			tokenTxs[i].prevPrevTx,
			guardInfo,
			revealTx,
			minterP2TR,
			txCtxs[i],
			sigs[i],
			false
		)
	}

	await unlockGuard(
		guardContract,
		guardInfo,
		guardInputIndex,
		newState,
		revealTx,
		receiverTokenState,
		changeTokenState,
		changeInfo,
		txCtxs[guardInputIndex],
		false
	)
	await wallet.dummySignFeeInput(revealTx)
	const vsize = revealTx.vsize
	resetTx(revealTx)
	return vsize
}

export function calcTotalAmount(tokens: TokenContract[]) {
	return tokens.reduce((acc, t) => acc + t.state.data.amount, 0n)
}

export function useTransfer(token: TokenData) {
	const [isTransferring, setIsTransferring] = useState(false)
	const { toast } = useToast()
	const { utxos, totalAmount } = useTokenUtxos(token)

	const handleTransfer = async (transferAmount: string, transferAddress: string) => {
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

			// Scale the transfer amount by token decimals
			const scaledAmount = BigInt(Math.round(transferAmountNumber * Math.pow(10, token.decimals)))

			// Select token UTXOs
			const selectedUtxos = []
			let selectedAmount = 0n
			for (const utxo of utxos) {
				if (selectedUtxos.length >= 4) break
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

			const payload = {
				token: token,
				amount: scaledAmount.toString(), // Use scaled amount here
				receiver: transferAddress,
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

			const response = await sendToken(
				wallet,
				payload.utxos[0],
				payload.feeRate,
				parseTokenMetadata(token),
				parseTokens(payload.tokenUtxos),
				btc.Address.fromString(payload.address),
				btc.Address.fromString(payload.receiver),
				scaledAmount,
				new Map()
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
				description: 'Your cat20 token transfer is in the mempool',
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

	return { isTransferring, handleTransfer, totalAmount }
}
