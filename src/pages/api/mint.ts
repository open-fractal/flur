import { NextApiRequest, NextApiResponse } from 'next'
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
	parseTokenMetadata,
	parseTokenMinter,
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
	getTxCtx,
	OpenMinterV2,
	ChangeInfo,
	int32,
	BurnGuard,
	TransferGuard,
	CAT20,
	OpenMinterV2Proto,
	OpenMinterV2State
} from '@/lib/scrypt/contracts/dist'
import { WalletService } from '@/lib/scrypt/providers'
import { scaleConfig } from '@/lib/scrypt/token'
import { Transaction } from '@scure/btc-signer'
import * as bitcoinjs from 'bitcoinjs-lib'

const OpenMinterArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinter.json')
OpenMinter.loadArtifact(OpenMinterArtifact)

const OpenMinterV2Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinterV2.json')
OpenMinterV2.loadArtifact(OpenMinterV2Artifact)

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const DUMMY_MINER_SIG =
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

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
	} else if (minterMd5 === MinterType.OPEN_MINTER_V2) {
		return pickOpenMinterStateFeild<bigint>(state, 'remainingSupplyCount')
	}
}

const calcVsize = async (
	wallet: WalletService,
	minter: OpenMinter | OpenMinterV2,
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
	cblockMinter: string
) => {
	const { shPreimage, prevoutsCtx, spentScripts } = getTxCtx(
		revealTx,
		inputIndex,
		Buffer.from(minterTapScript, 'hex')
	)

	const changeInfo: ChangeInfo = {
		script: toByteString(changeScript.toHex()),
		satoshis: int2ByteString(BigInt(0n), 8n)
	}

	const minterCall = await minter.methods.mint(
		newState.stateHashList,
		tokenMint,
		splitAmountList,
		await wallet.getPubKeyPrefix(),
		await wallet.getXOnlyPublicKey(),
		() => DUMMY_MINER_SIG,
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

	// @ts-ignore
	if (metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2) {
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
): Promise<string | Error> {
	metadata.timestamp = Date.now()

	const {
		utxo: minterUtxo,
		state: { protocolState, data: preState }
	} = minterContract

	const address = await wallet.getAddress()
	const tokenReceiver = await wallet.getTokenAddress()

	const tokenInfo = metadata.info as OpenMinterTokenInfo

	const scaledInfo = scaleConfig(tokenInfo)

	const tokenP2TR = btc.Script.fromAddress(metadata.tokenAddr).toHex()

	const genesisId = outpoint2ByteString(metadata.tokenId)

	const newState = ProtocolState.getEmptyState()

	const remainingSupply = getRemainSupply(preState, tokenInfo.minterMd5)

	if (!remainingSupply) {
		return new Error('No supply left in minter')
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

	const tokenState = CAT20Proto.create(mintAmount, tokenReceiver)

	newState.updateDataList(minterStates.length, CAT20Proto.toByteString(tokenState))

	let premineAddress =
		!preState.isPremined && scaledInfo.premine > 0n
			? await wallet.getTokenAddress()
			: scaledInfo.premine === 0n
			? ''
			: null

	if (premineAddress === null) {
		const address = await getPremineAddress(wallet, minterContract.utxo)

		if (address instanceof Error) {
			logerror(`get premine address failed!`, address)
			return address
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

	const revealTx = new btc.Transaction().from([minterUtxo, ...selectedFeeUtxos]).addOutput(
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
		logerror(`get raw transaction ${minterUtxo.txId} failed!`, commitTxHex)
		return commitTxHex
	}

	const commitTx = new btc.Transaction(commitTxHex)

	const prevPrevTxId = commitTx.inputs[minterInputIndex].prevTxId.toString('hex')
	const prevPrevTxHex = await getRawTransaction(prevPrevTxId)
	if (prevPrevTxHex instanceof Error) {
		logerror(`get raw transaction ${prevPrevTxId} failed!`, prevPrevTxHex)
		return prevPrevTxHex
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
		tokenState,
		splitAmountList,
		preTxState,
		preState,
		minterTapScript,
		minterInputIndex,
		revealTx,
		changeScript,
		backtraceInfo,
		cblockToken
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
			return new Error('Insufficient satoshis balance!')
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

	const { shPreimage, prevoutsCtx, spentScripts } = getTxCtx(
		revealTx,
		minterInputIndex,
		Buffer.from(minterTapScript, 'hex')
	)

	const changeInfo: ChangeInfo = {
		script: toByteString(changeScript.toHex()),
		satoshis: int2ByteString(BigInt(changeAmount), 8n)
	}

	const minterCall = await minter.methods.mint(
		newState.stateHashList,
		tokenState,
		splitAmountList,
		await wallet.getPubKeyPrefix(),
		await wallet.getXOnlyPublicKey(),
		() => DUMMY_MINER_SIG,
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
		Buffer.from(cblockToken, 'hex')
	]
	revealTx.inputs[minterInputIndex].witnesses = witnesses

	let psbt = Transaction.fromRaw(revealTx.toBuffer(), {
		allowUnknownOutputs: true
	})
	const psbt_bitcoinjs = bitcoinjs.Psbt.fromHex(Buffer.from(psbt.toPSBT()).toString('hex'))
	psbt_bitcoinjs.updateInput(0, {
		tapLeafScript: [
			{
				leafVersion: 192,
				script: Buffer.from(minterTapScript, 'hex'),
				controlBlock: witnesses[witnesses.length - 1]
			}
		]
	})
	psbt = Transaction.fromPSBT(Buffer.from(psbt_bitcoinjs.toHex(), 'hex'), {
		allowLegacyWitnessUtxo: true,
		allowUnknownOutputs: true
	})

	// @ts-ignore
	for (let i = 0; i < psbt.inputs.length; i++) {
		if (i == minterInputIndex) {
			// @ts-ignore
			psbt.inputs[i].witnessUtxo = {
				amount: BigInt(minterUtxo.satoshis) || 0n,
				script: Buffer.from(minterUtxo.script, 'hex') || btc.Script.empty()
			}
		} else {
			const utxo = selectedFeeUtxos[i - 1]
			if (!utxo) continue

			// @ts-ignore
			psbt.inputs[i].witnessUtxo = {
				amount: BigInt(utxo?.satoshis) || 0n,
				script: Buffer.from(utxo?.script, 'hex') || btc.Script.empty()
			}
			// @ts-ignore
			psbt.inputs[i].tapInternalKey = Buffer.from(await wallet.getXOnlyPublicKey(), 'hex')
			// @ts-ignore
			psbt.inputs[i].sighashType = 1
		}
	}

	return Buffer.from(psbt.toPSBT()).toString('hex')
}

type ResponseData = {
	psbt?: string
	message?: string
}

// async function getIndexerStatus() {
// 	try {
// 		const response = await axios.get(`${API_URL}/api`)
// 		return response.data.data
// 	} catch (error) {
// 		console.error('Error fetching indexer status:', error)
// 		throw error
// 	}
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	try {
		// Check indexer status

		// const indexerStatus = await getIndexerStatus()
		// const currentBlockHeight = indexerStatus.trackerBlockHeight
		// const chainTip = indexerStatus.nodeBlockHeight

		// if (chainTip - currentBlockHeight > 3) {
		// 	return res
		// 		.status(503)
		// 		.json({ message: 'Minting is temporarily disabled while the indexer is syncing' })
		// }

		if (process.env.SYNCING === 'true') {
			return res.status(400).json({ message: 'Minting is disabled while syncing' })
		}

		const payload = req.body

		if (!payload.token) {
			return res.status(400).json({ message: 'Token not found. Reload the page.' })
		}

		const token = parseTokenMetadata(payload.token)

		if (!token) {
			return res.status(404).json({ message: 'Token not found' })
		}

		const mintUtxoCount = payload.utxoCount

		if (mintUtxoCount <= 0) {
			return res.status(404).json({ message: 'Mint Ended' })
		}

		const minters = await parseTokenMinter(token, payload.minter)
		const minter = minters[0]
		const mintUtxoCreateCount = 2

		if (!minter) {
			return res.status(404).json({ message: 'Minter not found' })
		}

		const wallet = new WalletService(payload.address, payload.publicKey)
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
				// @ts-ignore
			} else if (token.info.minterMd5 == MinterType.OPEN_MINTER_V2 && amount != scaledInfo.limit) {
				console.warn(`can only mint at the exactly amount of ${scaledInfo.limit} at once`)
				amount = scaledInfo.limit
			}
		}

		console.log('minting', token.info.name, token.tokenId)
		const psbt = await openMint(
			wallet,
			payload.feeRate,
			payload.utxos,
			token,
			mintUtxoCreateCount,
			minter,
			scaledInfo.limit
		)

		if (!psbt) {
			return res.status(500).json({ message: 'Failed to create PSBT' })
		}

		res.status(200).json({ psbt: psbt as string })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}
