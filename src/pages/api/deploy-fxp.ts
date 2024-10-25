import { NextApiRequest, NextApiResponse } from 'next'
import { toByteString, UTXO } from 'scrypt-ts'
import {
	TokenMetadata,
	toStateScript,
	OpenMinterTokenInfo,
	getOpenMinterContractP2TR,
	outpoint2ByteString,
	Postage,
	toP2tr,
	btc,
	MinterType,
	script2P2TR,
	getTokenContractP2TR,
	TokenInfo,
	p2tr2Address,
	toXOnly
} from '@/lib/scrypt/common'

import {
	OpenMinter,
	OpenMinterProto,
	OpenMinterState,
	ProtocolState,
	int32,
	getCatCommitScript,
	OpenMinterV2Proto,
	OpenMinterV2State,
	getSHPreimage,
	OpenMinterV2,
	BurnGuard,
	TransferGuard,
	CAT20,
	FXPOpenMinter
} from '@/lib/scrypt/contracts/dist'

import { WalletService } from '@/lib/scrypt/providers'
import { scaleConfig } from '@/lib/scrypt/token'
import { Transaction } from '@scure/btc-signer'
import * as bitcoinjs from 'bitcoinjs-lib'
import axios from 'axios'
import { API_URL } from '@/lib/constants'

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
	const splitAmountList = OpenMinterProto.getSplitAmountList(
		premine + remainingSupply,
		mintAmount,
		limit,
		newMinter
	)

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

export async function getMinter(wallet: WalletService, genesisId: string, tokenInfo: TokenInfo) {
	// const scaledTokenInfo = scaleConfig(tokenInfo as OpenMinterTokenInfo);
	const scaledTokenInfo = scaleConfig(tokenInfo as OpenMinterTokenInfo)
	const premineAddress =
		scaledTokenInfo.premine > 0n ? await wallet.getTokenAddress() : toByteString('')

	if (!tokenInfo.minterMd5) {
		process.exit()
	}

	return getOpenMinterContractP2TR(
		genesisId,
		scaledTokenInfo.max,
		0n,
		scaledTokenInfo.limit,
		premineAddress,
		tokenInfo.minterMd5
	)
}

export function getMinterInitialTxState(
	tokenP2TR: string,
	tokenInfo: TokenInfo
): {
	protocolState: ProtocolState
	data: OpenMinterV2State
} {
	const protocolState = ProtocolState.getEmptyState()
	const scaledTokenInfo = scaleConfig(tokenInfo as OpenMinterTokenInfo)
	const maxCount = scaledTokenInfo.max / scaledTokenInfo.limit
	const premineCount = scaledTokenInfo.premine / scaledTokenInfo.limit
	const remainingSupply = maxCount - premineCount
	const minterState = OpenMinterV2Proto.create(tokenP2TR, false, remainingSupply)
	const outputState = OpenMinterV2Proto.toByteString(minterState)
	protocolState.updateDataList(0, outputState)
	return {
		protocolState,
		data: minterState
	}
}

const buildRevealTx = async (
	wallet: WalletService,
	genesisId: string,
	lockingScript: btc.Script,
	info: TokenInfo,
	commitTx: btc.Transaction,
	feeRate: number,
	taproot_private_key: btc.PrvateKey
): Promise<{ revealTx: btc.Transaction; tapScript: string; witnesses: Buffer[] }> => {
	const { p2tr: minterP2TR } = await getMinter(wallet, outpoint2ByteString(genesisId), info)

	const { tapScript, cblock } = script2P2TR(lockingScript)
	const { p2tr: tokenP2TR } = getTokenContractP2TR(minterP2TR)

	const { protocolState: txState } = getMinterInitialTxState(tokenP2TR, info)

	const revealTx = new btc.Transaction()
		.from([
			{
				txId: commitTx.id,
				outputIndex: 0,
				script: commitTx.outputs[0].script,
				satoshis: commitTx.outputs[0].satoshis
			},
			{
				txId: commitTx.id,
				outputIndex: 1,
				script: commitTx.outputs[1].script,
				satoshis: commitTx.outputs[1].satoshis
			}
		])
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: toStateScript(txState)
			})
		)
		.addOutput(
			new btc.Transaction.Output({
				satoshis: Postage.MINTER_POSTAGE,
				script: minterP2TR
			})
		)
		.feePerByte(feeRate)

	const witnesses: Buffer[] = []

	const { sighash } = getSHPreimage(revealTx, 0, Buffer.from(tapScript, 'hex'))

	const sig = btc.crypto.Schnorr.sign(taproot_private_key, sighash.hash)

	for (let i = 0; i < txState.stateHashList.length; i++) {
		const txoStateHash = txState.stateHashList[i]
		witnesses.push(Buffer.from(txoStateHash, 'hex'))
	}
	witnesses.push(sig)
	witnesses.push(lockingScript)
	witnesses.push(Buffer.from(cblock, 'hex'))

	revealTx.inputs[0].witnesses = witnesses

	return { revealTx, tapScript, witnesses }
}

export async function deploy(
	params: TokenInfo,
	feeRate: number,
	utxos: UTXO[],
	wallet: WalletService
): Promise<ResponseData | undefined> {
	// let pk = btc.PrivateKey.fromBuffer(Buffer.from('abddaecf30b891e99755870fa8bcb28c223271a48f066ca2c77b4e7901e6c0a0', 'hex'))
	const pk = btc.PrivateKey.fromRandom()
	// window.Buffer = Buffer
	const { tweakedPrivKey } = pk.createTapTweak()
	const taproot_private_key = btc.PrivateKey.fromBuffer(tweakedPrivKey)
	const publicKey = taproot_private_key.toPublicKey()
	const pubkeyX = toXOnly(publicKey.toBuffer()).toString('hex')

	const changeAddress: btc.Address = await wallet.getAddress()

	// const pubkeyX = await wallet.getXOnlyPublicKey();
	const commitScript = getCatCommitScript(pubkeyX, params)

	const lockingScript = Buffer.from(commitScript, 'hex')
	const { p2tr: p2tr } = script2P2TR(lockingScript)

	const changeScript = btc.Script.fromAddress(changeAddress)

	const commitTx = new btc.Transaction()
		.from(utxos)
		.addOutput(
			new btc.Transaction.Output({
				satoshis: Postage.METADATA_POSTAGE,
				script: p2tr
			})
		)
		.addOutput(
			/** utxo to pay revealTx fee */
			new btc.Transaction.Output({
				satoshis: 0,
				script: changeScript
			})
		)

	if (process.env.NEXT_PUBLIC_FEE_ADDRESS && process.env.NEXT_PUBLIC_FEE_SATS) {
		commitTx.addOutput(
			new btc.Transaction.Output({
				script: btc.Script.fromAddress(process.env.NEXT_PUBLIC_FEE_ADDRESS),
				satoshis: parseInt(process.env.NEXT_PUBLIC_FEE_SATS)
			})
		)
	}

	commitTx.feePerByte(feeRate).change(changeAddress)

	if (commitTx.getChangeOutput() === null) {
		throw new Error('Insufficient satoshi balance!')
	}

	const dummyGenesisId = `${'0000000000000000000000000000000000000000000000000000000000000000'}_0`

	const { revealTx: revealTxDummy } = await buildRevealTx(
		wallet,
		dummyGenesisId,
		lockingScript,
		params,
		commitTx,
		feeRate,
		taproot_private_key
	)

	const revealTxFee = revealTxDummy.vsize * feeRate + Postage.MINTER_POSTAGE

	commitTx.outputs[1].satoshis = revealTxFee

	commitTx.change(changeAddress)
	if (commitTx.outputs[2] && commitTx.outputs[2].satoshi > 1) {
		commitTx.outputs[2].satoshis -= 1
	}

	const genesisId = `${commitTx.id}_0`

	const { revealTx, tapScript, witnesses } = await buildRevealTx(
		wallet,
		genesisId,
		lockingScript,
		params,
		commitTx,
		feeRate,
		taproot_private_key
	)

	const { p2tr: minterP2TR } = await getMinter(wallet, outpoint2ByteString(genesisId), params)
	const { p2tr: tokenP2TR } = getTokenContractP2TR(minterP2TR)

	// commitTx.enableRBF()
	// revealTx.enableRBF()

	const commitPsbt = Transaction.fromRaw(commitTx.toBuffer())
	let revealPsbt = Transaction.fromRaw(revealTx.toBuffer(), {
		allowUnknownInputs: true,
		allowUnknownOutputs: true
	})

	const psbt_bitcoinjs = bitcoinjs.Psbt.fromHex(Buffer.from(revealPsbt.toPSBT()).toString('hex'))
	psbt_bitcoinjs.updateInput(0, {
		tapLeafScript: [
			{
				leafVersion: 192,
				script: Buffer.from(tapScript, 'hex'),
				controlBlock: witnesses[witnesses.length - 1]
			}
		]
	})
	revealPsbt = Transaction.fromPSBT(Buffer.from(psbt_bitcoinjs.toHex(), 'hex'), {
		allowLegacyWitnessUtxo: true,
		allowUnknownOutputs: true
	})

	// @ts-ignore
	for (let i = 0; i < commitPsbt.inputs.length; i++) {
		const utxo = utxos.find(
			utxo =>
				// @ts-ignore
				utxo.txId === Buffer.from(commitPsbt.inputs[i].txid).toString('hex') &&
				// @ts-ignore
				utxo.outputIndex === commitPsbt.inputs[i].index
		)

		if (!utxo) {
			continue
		}

		// @ts-ignore
		commitPsbt.inputs[i].witnessUtxo = {
			amount: BigInt(utxo?.satoshis) || 0n,
			script: Buffer.from(utxo?.script, 'hex') || btc.Script.empty()
		}
		// @ts-ignore
		commitPsbt.inputs[i].tapInternalKey = Buffer.from(await wallet.getXOnlyPublicKey(), 'hex')
		// @ts-ignore
		commitPsbt.inputs[i].sighashType = 1
	}

	// @ts-ignore
	revealPsbt.inputs[0].witnessUtxo = commitPsbt.outputs[0]
	// @ts-ignore
	revealPsbt.inputs[1].witnessUtxo = commitPsbt.outputs[1]

	return {
		tokenId: genesisId,
		tokenAddr: p2tr2Address(tokenP2TR, 'fractal-mainnet'),
		minterAddr: p2tr2Address(minterP2TR, 'fractal-mainnet'),
		commitPsbt: Buffer.from(commitPsbt.toPSBT()).toString('hex'),
		revealPsbt: Buffer.from(revealPsbt.toPSBT()).toString('hex')
	}
}

type ResponseData = {
	tokenId?: string
	tokenAddr?: string
	minterAddr?: string
	commitPsbt?: string
	revealPsbt?: string
	message?: string
}

async function getIndexerStatus() {
	try {
		const response = await axios.get(`${API_URL}/api`)
		return response.data.data
	} catch (error) {
		console.error('Error fetching indexer status:', error)
		throw error
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	try {
		// Check indexer status
		await getIndexerStatus()

		const payload = req.body
		const wallet = new WalletService(payload.address, payload.publicKey)

		const params = {
			name: payload.params.name as string,
			symbol: payload.params.symbol as string,
			limit: BigInt(payload.params.limit),
			max: BigInt(payload.params.max),
			decimals: 2,
			premine: 0n,
			minterMd5: MinterType.FXP_OPEN_MINTER as string
		}

		const response = await deploy(params, payload.feeRate, payload.utxos, wallet)

		if (!response) {
			return res.status(500).json({ message: 'Failed to create PSBT' })
		}

		res.status(200).json(response)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}
