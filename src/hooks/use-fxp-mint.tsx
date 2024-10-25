import { useState } from 'react'
import axios from 'axios' // Add this import at the top of the file
import { EXPLORER_URL, API_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'
import { hash160 } from 'scrypt-ts'
import { XrayedTxIdPreimg1 } from '@/lib/scrypt/contracts/dist/contracts/utils/txProof'

import { toByteString, UTXO, MethodCallOptions, int2ByteString } from 'scrypt-ts'
import {
	getRawTransaction,
	getDummySigner,
	getDummyUTXO,
	callToBufferList,
	TokenMetadata,
	resetTx,
	toStateScript,
	OpenMinterTokenInfo,
	getOpenMinterContractP2TR,
	OpenMinterContract,
	outpoint2ByteString,
	Postage,
	toP2tr,
	logerror,
	btc,
	parseTokens,
	parseTokenMetadata,
	parseTokenMinter,
	TokenContract,
	MinterType
} from '@/lib/scrypt/common'

import {
	getBackTraceInfo,
	OpenMinter,
	OpenMinterProto,
	OpenMinterState,
	ProtocolState,
	CAT20State,
	CAT20Proto,
	PreTxStatesInfo,
	getTxCtxMulti,
	OpenMinterV2,
	ChangeInfo,
	int32,
	BurnGuard,
	TransferGuard,
	CAT20,
	OpenMinterV2Proto,
	OpenMinterV2State,
	FXPOpenMinter,
	txToTxHeader,
	txToTxHeaderPartial,
	FXPBuyGuard,
	FXPSellGuard
} from '@/lib/scrypt/contracts/dist'
import { TaprootSmartContract, CatTx } from '@/lib/scrypt/contracts/dist/lib/catTx'
import { WalletService } from '@/lib/scrypt/providers/unisatWalletService'
import { scaleConfig } from '@/lib/scrypt/token'
import { unlockTaprootContractInput } from './use-take-sell'
import { getTokenUtxo } from './use-token-orderbook'

const OpenMinterArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinter.json')
OpenMinter.loadArtifact(OpenMinterArtifact)

const OpenMinterV2Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinterV2.json')
OpenMinterV2.loadArtifact(OpenMinterV2Artifact)

const FXPOpenMinterArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPOpenMinter.json')
FXPOpenMinter.loadArtifact(FXPOpenMinterArtifact)

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const FXPBuyGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPBuyGuard.json')
FXPBuyGuard.loadArtifact(FXPBuyGuardArtifact)

const FXPSellGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPSellGuard.json')
FXPSellGuard.loadArtifact(FXPSellGuardArtifact)

function selectUtxos(utxos: UTXO[], targetAmount: number): UTXO[] {
	const sortedUtxos = utxos.sort((a, b) => b.satoshis - a.satoshis)
	const selectedUtxos: UTXO[] = []
	let totalSatoshis = 0
	for (const utxo of sortedUtxos) {
		if (totalSatoshis >= targetAmount) break
		selectedUtxos.push(utxo)
		totalSatoshis += utxo.satoshis
	}
	return selectedUtxos
}

const getPremineAddress = async (wallet: WalletService, utxo: UTXO): Promise<string | Error> => {
	const txhex = await getRawTransaction(utxo.txId)
	if (txhex instanceof Error) {
		logerror(`get raw transaction ${utxo.txId} failed!`, txhex)
		return txhex
	}
	try {
		const tx = new btc.Transaction(txhex)
		const witnesses: Buffer[] = tx.inputs[0].getWitnesses()
		const lockingScript = witnesses[witnesses.length - 2]
		try {
			const minter = OpenMinterV2.fromLockingScript(lockingScript.toString('hex')) as OpenMinterV2
			return minter.premineAddr
		} catch (e) {}
		const minter = OpenMinter.fromLockingScript(lockingScript.toString('hex')) as OpenMinter
		return minter.premineAddr
	} catch (error) {
		return new Error(`${error}`)
	}
}
export function pickOpenMinterStateFeild<T>(
	state: OpenMinterState | OpenMinterV2State,
	key: string
): T | undefined {
	if (Object.prototype.hasOwnProperty.call(state, key)) {
		return (state as any)[key]
	}
	return undefined
}

export function getRemainSupply(state: OpenMinterState | OpenMinterV2State, minterMd5: string) {
	// @ts-ignore
	if (minterMd5 === MinterType.OPEN_MINTER_V1) {
		return pickOpenMinterStateFeild<bigint>(state, 'remainingSupply')
		// @ts-ignore
	} else if (minterMd5 === MinterType.OPEN_MINTER_V2 || minterMd5 === MinterType.FXP_OPEN_MINTER) {
		return pickOpenMinterStateFeild<bigint>(state, 'remainingSupplyCount')
	}
}

const getOrderGuard = (
	tradeTx: btc.Transaction,
	order: any
):
	| {
			guard: TaprootSmartContract
			preTx: XrayedTxIdPreimg1
			makerState: CAT20State
			takerPubKey: string
	  }
	| undefined => {
	const buyGuard = TaprootSmartContract.create(new FXPBuyGuard())
	const sellGuard = TaprootSmartContract.create(new FXPSellGuard())

	let guard: TaprootSmartContract | undefined
	let takerPubKey = order.takerPubKey

	const preTxHeader = txToTxHeader(tradeTx)
	const preTx = txToTxHeaderPartial(preTxHeader)

	const guardOutput =
		tradeTx.outputs.length === 5
			? Buffer.from(tradeTx.outputs[3].script.toBuffer()).toString('hex')
			: Buffer.from(tradeTx.outputs[4].script.toBuffer()).toString('hex')
	const noChangeFillBuyGuardOutput = Buffer.from(tradeTx.outputs[3].script.toBuffer()).toString(
		'hex'
	)
	const makerAddr = hash160(order.ownerPubKey)

	if (
		guardOutput === buyGuard.lockingScriptHex ||
		noChangeFillBuyGuardOutput === buyGuard.lockingScriptHex
	) {
		guard = buyGuard
		// makerAddr = hash160(order.ownerPubKey)
		// takerAddr = hash160(order.takerPubKey)
	} else if (guardOutput === sellGuard.lockingScriptHex) {
		// makerAddr = hash160(order.takerPubKey)
		// takerAddr = hash160(order.ownerPubKey)
		guard = sellGuard
		takerPubKey = order.ownerPubKey
	}

	if (!guard) {
		return undefined
	}

	const makerState = CAT20Proto.create(FXPOpenMinter.getFXPAmount(preTx), makerAddr)
	// const takerState = CAT20Proto.create(FXPOpenMinter.getFXPAmount(preTx), takerAddr)

	return { guard, preTx, makerState, takerPubKey }
}

const calcVsize = async (
	wallet: WalletService,
	minter: OpenMinter | OpenMinterV2 | FXPOpenMinter,
	newState: ProtocolState,
	tokenMint: CAT20State,
	splitAmountList: Array<bigint>,
	preTxState: PreTxStatesInfo,
	preState: OpenMinterState | OpenMinterV2State,
	minterTapScript: string,
	inputIndex: number,
	revealTx: btc.Transaction,
	changeScript: btc.Script,
	backtraceInfo: any,
	cblockMinter: string,
	tradeTx: btc.Transaction,
	tradeToken: TokenContract,
	order: any
) => {
	const res = getOrderGuard(tradeTx, order)

	if (!res) {
		return new Error('Invalid guard')
	}

	const { guard, preTx } = res

	const ctxList = getTxCtxMulti(
		revealTx,
		[inputIndex, 1],
		[Buffer.from(minterTapScript, 'hex'), guard.tapleafBuffer]
	)

	const { shPreimage, prevoutsCtx, spentScripts } = ctxList[0]
	const {
		shPreimage: guardShPreimage,
		prevoutsCtx: guardPrevoutsCtx,
		spentScripts: guardSpentScripts
	} = ctxList[1]

	const changeInfo: ChangeInfo = {
		script: toByteString(changeScript.toHex()),
		satoshis: int2ByteString(BigInt(0n), 8n)
	}

	await guard.contract.connect(getDummySigner())
	const redeemCall = await guard.contract.methods.redeem(
		preTx,
		tradeToken.state.data,
		{
			statesHashRoot: tradeToken.state.protocolState.hashRoot,
			txoStateHashes: tradeToken.state.protocolState.stateHashList
		},
		guardShPreimage,
		guardPrevoutsCtx,
		guardSpentScripts,
		{
			fromUTXO: getDummyUTXO(),
			verify: false,
			exec: false
		} as MethodCallOptions<FXPSellGuard>
	)
	unlockTaprootContractInput(redeemCall, guard, revealTx, tradeTx, 1, false, false)

	const xpAmountHash = FXPOpenMinter.getFXPAmountHash(preTx)
	const takerAddr = hash160(order.takerPubKey)

	const minterCall = await minter.methods.mint(
		newState.stateHashList,
		tokenMint,
		tokenMint.amount / 100n,
		splitAmountList,
		preTx,
		tradeToken.state.data,
		{
			statesHashRoot: tradeToken.state.protocolState.hashRoot,
			txoStateHashes: tradeToken.state.protocolState.stateHashList
		},
		xpAmountHash.slice(2),
		takerAddr,
		int2ByteString(BigInt(Postage.MINTER_POSTAGE), 8n),
		int2ByteString(BigInt(Postage.TOKEN_POSTAGE), 8n),
		preState,
		preTxState,
		backtraceInfo,
		shPreimage,
		prevoutsCtx,
		spentScripts,
		changeInfo,
		{
			fromUTXO: getDummyUTXO(),
			verify: false,
			exec: false
		} as MethodCallOptions<OpenMinter>
	)

	const witnesses = [
		...callToBufferList(minterCall),
		minter.lockingScript.toBuffer(),
		Buffer.from(cblockMinter, 'hex')
	]
	revealTx.inputs[inputIndex].witnesses = witnesses
	const vsize = revealTx.vsize

	resetTx(revealTx)
	return vsize
}

export function createOpenMinterState(
	mintAmount: int32,
	isPriemined: boolean,
	remainingSupply: int32,
	metadata: TokenMetadata,
	newMinter: number
): {
	splitAmountList: bigint[]
	minterStates: OpenMinterState[]
} {
	const scaledInfo = scaleConfig(metadata.info as OpenMinterTokenInfo)

	const premine = !isPriemined ? scaledInfo.premine : 0n
	const limit = scaledInfo.limit
	let splitAmountList = OpenMinterProto.getSplitAmountList(
		premine + remainingSupply,
		mintAmount,
		limit,
		newMinter
	)

	if (
		// @ts-ignore
		metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2 ||
		// @ts-ignore
		metadata.info.minterMd5 == MinterType.FXP_OPEN_MINTER
	) {
		splitAmountList = OpenMinterV2Proto.getSplitAmountList(
			remainingSupply,
			isPriemined,
			scaledInfo.premine
		)
	}
	const tokenP2TR = toP2tr(metadata.tokenAddr)

	const minterStates: Array<OpenMinterState> = []
	for (let i = 0; i < splitAmountList.length; i++) {
		const amount = splitAmountList[i]
		if (amount > 0n) {
			const minterState = OpenMinterProto.create(tokenP2TR, true, amount)
			minterStates.push(minterState)
		}
	}

	return { splitAmountList, minterStates }
}

async function openMint(
	wallet: WalletService,
	feeRate: number,
	feeUtxos: UTXO[],
	metadata: TokenMetadata,
	newMinter: number /* number of new minter utxo */,
	minterContract: OpenMinterContract,
	mintAmount: bigint
): Promise<{ revealTx: btc.Transaction; amount: bigint }> {
	metadata.timestamp = Date.now()

	const {
		utxo: minterUtxo,
		state: { protocolState, data: preState }
	} = minterContract

	const address = await wallet.getAddress()

	const { data: orderData } = await axios.get(
		`${API_URL}/api/orderbook/address/${address}/fxp-claim`
	)
	const order = orderData.data.utxos[0]

	if (!order) {
		throw new Error('No claim utxos found')
	}

	const tradeTxid = order.spendTxid
	const tradeRawtx = await getRawTransaction(tradeTxid)
	const tradeTx = new btc.Transaction(tradeRawtx)
	const orderTokenUtxo = await getTokenUtxo(tradeTxid, 1)
	const orderGuardUtxo =
		tradeTx.outputs.length === 5
			? {
					txId: tradeTxid,
					outputIndex: 3,
					satoshis: tradeTx.outputs[3].satoshis,
					script: tradeTx.outputs[3].script
			  }
			: {
					txId: tradeTxid,
					outputIndex: 4,
					satoshis: tradeTx.outputs[4].satoshis,
					script: tradeTx.outputs[4].script
			  }

	if (!orderTokenUtxo) {
		throw new Error('Token UTXO not found')
	}

	const orderToken = parseTokens([orderTokenUtxo])[0]

	const tokenInfo = metadata.info as OpenMinterTokenInfo
	const scaledInfo = scaleConfig(tokenInfo)
	const tokenP2TR = btc.Script.fromAddress(metadata.tokenAddr).toHex()
	const genesisId = outpoint2ByteString(metadata.tokenId)
	const newState = ProtocolState.getEmptyState()
	const remainingSupply = getRemainSupply(preState, tokenInfo.minterMd5)

	if (!remainingSupply) {
		throw new Error('No supply left in minter')
	}

	const { splitAmountList, minterStates } = createOpenMinterState(
		mintAmount,
		preState.isPremined,
		remainingSupply,
		metadata,
		newMinter
	)

	for (let i = 0; i < minterStates.length; i++) {
		const minterState = minterStates[i]
		newState.updateDataList(i, OpenMinterProto.toByteString(minterState))
	}

	const res = getOrderGuard(tradeTx, order)

	if (!res) {
		throw new Error('Invalid guard')
	}

	const { guard, preTx, makerState, takerPubKey } = res

	newState.updateDataList(minterStates.length, CAT20Proto.toByteString(makerState))
	// newState.updateDataList(minterStates.length + 1, CAT20Proto.toByteString(takerState))

	let premineAddress =
		!preState.isPremined && scaledInfo.premine > 0n
			? await wallet.getTokenAddress()
			: scaledInfo.premine === 0n
			? ''
			: null

	if (premineAddress === null) {
		const address = await getPremineAddress(wallet, minterContract.utxo)

		if (address instanceof Error) {
			throw new Error('get premine address failed!')
		}

		premineAddress = address
	}

	const {
		tapScript: minterTapScript,
		cblock: cblockToken,
		contract: minter
	} = getOpenMinterContractP2TR(
		genesisId,
		scaledInfo.max,
		scaledInfo.premine,
		scaledInfo.limit,
		premineAddress,
		tokenInfo.minterMd5
	)

	const changeScript = btc.Script.fromAddress(address)

	const initialRequiredAmount =
		Postage.MINTER_POSTAGE * newMinter +
		Postage.TOKEN_POSTAGE +
		(process.env.FEE_SATS ? parseInt(process.env.FEE_SATS) : 0)

	// Select UTXOs based on the initial required amount
	const selectedFeeUtxos = selectUtxos(feeUtxos, initialRequiredAmount)
	// Add selected UTXOs to the transaction

	const catTx = CatTx.create()
	catTx.tx.from([minterUtxo, orderGuardUtxo, ...selectedFeeUtxos])

	for (let i = 0; i < splitAmountList.length; i++) {
		const amount = splitAmountList[i]
		if (amount > 0n) {
			const splitMinterState = OpenMinterV2Proto.create(tokenP2TR, true, amount)
			catTx.addStateContractOutput(
				minterUtxo.script,
				OpenMinterV2Proto.toByteString(splitMinterState),
				Postage.MINTER_POSTAGE
			)
		}
	}

	// Maker
	catTx.addStateContractOutput(tokenP2TR, CAT20Proto.toByteString(makerState))
	// Taker
	// catTx.addStateContractOutput(tokenP2TR, CAT20Proto.toByteString(takerState))

	catTx.tx
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: changeScript
			})
		)
		.feePerByte(feeRate)
		.enableRBF()

	const revealTx = new btc.Transaction()
		.from([minterUtxo, orderGuardUtxo, ...selectedFeeUtxos])
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: toStateScript(newState)
			})
		)

	for (let i = 0; i < splitAmountList.length; i++) {
		if (splitAmountList[i] > 0n) {
			revealTx.addOutput(
				new btc.Transaction.Output({
					script: new btc.Script(minterUtxo.script),
					satoshis: Postage.MINTER_POSTAGE
				})
			)
		}
	}

	revealTx.addOutput(
		new btc.Transaction.Output({
			satoshis: Postage.TOKEN_POSTAGE,
			script: tokenP2TR
		})
	)

	revealTx
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: changeScript
			})
		)
		.feePerByte(feeRate)
		.enableRBF()

	const minterInputIndex = 0

	const commitTxHex = await getRawTransaction(minterUtxo.txId)
	if (commitTxHex instanceof Error) {
		throw new Error('get raw transaction failed!')
	}

	const commitTx = new btc.Transaction(commitTxHex)

	const prevPrevTxId = commitTx.inputs[minterInputIndex].prevTxId.toString('hex')
	const prevPrevTxHex = await getRawTransaction(prevPrevTxId)
	if (prevPrevTxHex instanceof Error) {
		throw new Error('get raw transaction failed!')
	}

	const prevPrevTx = new btc.Transaction(prevPrevTxHex)

	const backtraceInfo = getBackTraceInfo(commitTx, prevPrevTx, minterInputIndex)

	const dummySigner = getDummySigner()
	await minter.connect(dummySigner)

	const preTxState: PreTxStatesInfo = {
		statesHashRoot: protocolState.hashRoot,
		txoStateHashes: protocolState.stateHashList
	}

	const vsize: number = await calcVsize(
		wallet,
		minter as OpenMinter,
		newState,
		makerState,
		splitAmountList,
		preTxState,
		preState,
		minterTapScript,
		minterInputIndex,
		revealTx,
		changeScript,
		backtraceInfo,
		cblockToken,
		tradeTx,
		orderToken,
		order
	)

	let changeAmount =
		revealTx.inputAmount -
		vsize * feeRate -
		Postage.MINTER_POSTAGE * newMinter -
		Postage.TOKEN_POSTAGE

	if (process.env.FEE_ADDRESS && process.env.FEE_SATS) {
		changeAmount -= parseInt(process.env.FEE_SATS)
	}

	if (changeAmount < 546) {
		const additionalRequired = 546 - changeAmount
		const additionalUtxos = selectUtxos(
			feeUtxos.filter(utxo => !selectedFeeUtxos.includes(utxo)),
			additionalRequired
		)
		if (additionalUtxos.length === 0) {
			throw new Error('Insufficient satoshis balance!')
		}
		revealTx.from(additionalUtxos)
		selectedFeeUtxos.push(...additionalUtxos)
		// Recalculate changeAmount
		changeAmount =
			revealTx.inputAmount -
			vsize * feeRate -
			Postage.MINTER_POSTAGE * newMinter -
			Postage.TOKEN_POSTAGE
		if (process.env.FEE_ADDRESS && process.env.FEE_SATS) {
			changeAmount -= parseInt(process.env.FEE_SATS)
		}
	}

	// update change amount
	const changeOutputIndex = revealTx.outputs.length - 1
	revealTx.outputs[changeOutputIndex].satoshis = changeAmount

	const ctxList = getTxCtxMulti(
		revealTx,
		[minterInputIndex, 1],
		[Buffer.from(minterTapScript, 'hex'), guard.tapleafBuffer]
	)

	const { shPreimage, prevoutsCtx, spentScripts } = ctxList[0]
	const {
		shPreimage: guardShPreimage,
		prevoutsCtx: guardPrevoutsCtx,
		spentScripts: guardSpentScripts
	} = ctxList[1]

	const changeInfo: ChangeInfo = {
		script: toByteString(changeScript.toHex()),
		satoshis: int2ByteString(BigInt(changeAmount), 8n)
	}

	await guard.contract.connect(getDummySigner())
	const redeemCall = await guard.contract.methods.redeem(
		preTx,
		orderToken.state.data,
		{
			statesHashRoot: orderToken.state.protocolState.hashRoot,
			txoStateHashes: orderToken.state.protocolState.stateHashList
		},
		guardShPreimage,
		guardPrevoutsCtx,
		guardSpentScripts,
		{
			fromUTXO: getDummyUTXO(),
			verify: false,
			exec: false
		} as MethodCallOptions<FXPSellGuard>
	)
	unlockTaprootContractInput(redeemCall, guard, revealTx, tradeTx, 1, false, false)

	const xpAmountHash = FXPOpenMinter.getFXPAmountHash(preTx)

	const minterCall = await minter.methods.mint(
		newState.stateHashList,
		makerState,
		makerState.amount / 100n,
		splitAmountList,
		preTx,
		orderToken.state.data,
		{
			statesHashRoot: orderToken.state.protocolState.hashRoot,
			txoStateHashes: orderToken.state.protocolState.stateHashList
		},
		xpAmountHash.slice(2),
		takerPubKey,
		int2ByteString(BigInt(Postage.MINTER_POSTAGE), 8n),
		int2ByteString(BigInt(Postage.TOKEN_POSTAGE), 8n),
		preState,
		preTxState,
		backtraceInfo,
		shPreimage,
		prevoutsCtx,
		spentScripts,
		changeInfo,
		{
			fromUTXO: getDummyUTXO(),
			verify: false,
			exec: true
		} as MethodCallOptions<OpenMinter>
	)

	const witnesses = [
		...callToBufferList(minterCall),
		minter.lockingScript.toBuffer(),
		Buffer.from(cblockToken, 'hex')
	]
	revealTx.inputs[minterInputIndex].witnesses = witnesses

	return { revealTx, amount: makerState.amount / 100n }
}

export function useFXPMint(tokenId: string) {
	const [isMinting, setIsMinting] = useState(false)
	const { toast } = useToast()

	// const { utxoCount } = useMinterUtxoCount(tokenId)

	const handleMint = async (
		utxoCount: number,
		onSuccess: (amount: number, txid: string) => void
	) => {
		// Check if Unisat wallet is connected
		if (!window.unisat || !(await window.unisat.getAccounts()).length) {
			toast({
				title: 'Wallet Not Connected',
				description: 'Please connect your Unisat wallet to mint tokens.',
				variant: 'destructive',
				action: <Button onClick={() => window.unisat.requestAccounts()}>Connect Wallet</Button>
			})
			return
		}

		// Check if the wallet is using a P2TR address
		const address = (await window.unisat.getAccounts())[0]
		if (!address.startsWith('bc1p')) {
			toast({
				title: 'Incompatible Wallet Type',
				description: 'Please use a P2TR (Taproot) address to mint tokens.',
				variant: 'destructive'
			})
			return
		}

		setIsMinting(true)

		const { getTokenMetadata } = await import('@/lib/scrypt/common')

		try {
			const [feeRate, utxos, tokenData] = await Promise.all([
				getFeeRate(),
				window.unisat.getBitcoinUtxos(),
				getTokenMetadata(tokenId)
			])

			const {
				data: { data: rawMinters }
			} = await axios.get(`${API_URL}/api/minters/${tokenId}/utxos`)

			const randomIndex = Math.floor(Math.random() * rawMinters.utxos.length)
			const rawMinter = rawMinters.utxos[randomIndex]

			if (!rawMinter) {
				toast({
					title: 'Minter Not Found',
					description: 'No minter found for the given token.',
					variant: 'destructive'
				})
				setIsMinting(false)
				return
			}

			// Check if there are any UTXOs available
			if (!utxos || utxos.length === 0) {
				toast({
					title: 'Insufficient Balance',
					description: 'You do not have enough balance to mint tokens.',
					variant: 'destructive'
				})
				setIsMinting(false)
				return
			}

			const payload = {
				utxoCount: utxoCount,
				token: tokenData,
				feeRate: feeRate,
				publicKey: await window.unisat.getPublicKey(),
				address: (await window.unisat.getAccounts())[0],
				minter: rawMinter,
				utxos: utxos
					.map((utxo: any) => ({
						txId: utxo.txid,
						outputIndex: utxo.vout,
						script: utxo.scriptPk,
						satoshis: utxo.satoshis
					}))
					.slice(0, 100)
			}

			const token = parseTokenMetadata(payload.token)

			if (!token) {
				throw new Error('Token not found')
			}

			const mintUtxoCount = payload.utxoCount

			if (!mintUtxoCount || mintUtxoCount <= 0) {
				throw new Error('Mint Ended')
			}

			const minters = await parseTokenMinter(token, payload.minter)
			const minter = minters[0]
			const mintUtxoCreateCount = 2

			if (!minter) {
				throw new Error('Minter not found')
			}

			const wallet = new WalletService()
			// Scale the limit by 10^decimals to account for token precision
			// @ts-ignore
			const scaledLimit = BigInt(token.info.limit) * BigInt(10 ** token.info.decimals)

			const scaledInfo = scaleConfig(token.info as OpenMinterTokenInfo)

			let amount: bigint | undefined = scaledLimit

			if (!minter.state.data.isPremined && scaledInfo.premine > 0n) {
				if (typeof amount === 'bigint') {
					if (amount !== scaledInfo.premine) {
						throw new Error(`first mint amount should equal to premine ${scaledInfo.premine}`)
					}
				} else {
					amount = scaledInfo.premine
				}
			} else {
				amount = amount || scaledInfo.limit
				// @ts-ignore
				if (token.info.minterMd5 === MinterType.OPEN_MINTER_V1) {
					if (
						// @ts-ignore
						getRemainSupply(minter.state.data, token.info.minterMd5) < scaledInfo.limit
					) {
						//   console.warn(
						//     `small limit of ${unScaleByDecimals(limit, token.info.decimals)} in the minter UTXO!`,
						//   );
						//   log(`retry to mint token [${token.info.symbol}] ...`);
						//   continue;
					}
					amount =
						amount >
						// @ts-ignore
						getRemainSupply(minter.state.data, token.info.minterMd5)
							? getRemainSupply(minter.state.data, token.info.minterMd5)
							: amount
				} else if (
					// @ts-ignore
					(token.info.minterMd5 == MinterType.OPEN_MINTER_V2 ||
						// @ts-ignore
						token.info.minterMd5 === MinterType.FXP_OPEN_MINTER) &&
					amount != scaledInfo.limit
				) {
					console.warn(`can only mint at the exactly amount of ${scaledInfo.limit} at once`)
					amount = scaledInfo.limit
				}
			}

			console.log('minting', token.info.name, token.tokenId)
			const { revealTx, amount: mintAmount } = await openMint(
				wallet,
				payload.feeRate,
				payload.utxos,
				token,
				mintUtxoCreateCount,
				minter,
				scaledInfo.limit
			)

			await wallet.signFeeInput(revealTx)

			const txid = await broadcast(revealTx.uncheckedSerialize())
			// const txid = ''
			// console.log('txid', txid)

			if (txid instanceof Error) {
				// @ts-ignore
				const message = txid.response.data

				if (
					message.includes(
						'sendrawtransaction RPC error: {"code":-26,"message":"txn-mempool-conflict"}'
					)
				) {
					// @ts-ignore
					const prev_txid = Buffer.from(signedPsbt.inputs[0].txid, 'hex').toString('hex')
					// @ts-ignore
					const prev_vout = signedPsbt.inputs[0].index

					console.log(`${EXPLORER_URL}/tx/${prev_txid}`)
					console.log(`${prev_txid}:${prev_vout}`)
				}

				// Show error toast
				toast({
					title: 'Failed to Broadcast',
					// @ts-ignore
					description: txid.response.data,
					variant: 'destructive'
				})
			} else {
				// Show success toast with explorer link using shadcn Button
				onSuccess(Number(mintAmount), txid)
				toast({
					title: 'Transaction Broadcasted!',
					description:
						'Your mint is in the mempool and will be confirmed if you are the highest bidder.',
					action: (
						<Button asChild>
							<a href={`${EXPLORER_URL}/tx/${txid}`} target="_blank" rel="noopener noreferrer">
								View Transaction
							</a>
						</Button>
					)
				})
			}
		} catch (error) {
			console.error('Minting failed:', error)

			// Show error toast
			toast({
				title: 'Minting Failed',
				description:
					error instanceof Error
						? // @ts-ignore
						  error?.response?.data?.message || error.message
						: 'An unexpected error occurred while minting your token.',
				variant: 'destructive'
			})
		} finally {
			setIsMinting(false)
		}
	}

	return { isMinting, handleMint }
}
