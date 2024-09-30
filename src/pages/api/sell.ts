import { NextApiRequest, NextApiResponse } from 'next'
import { UTXO, hash160 } from 'scrypt-ts'
import { TokenMetadata, btc } from '@/lib/scrypt/common'
import { psbtFromTx } from '@/lib/psbt'
import { TaprootSmartContract } from '@/lib/scrypt/contracts/dist/lib/catTx'

import { CAT20, BurnGuard, TransferGuard } from '@/lib/scrypt/contracts/dist'
import { CAT20Sell } from '@/lib/scrypt/contracts/orderbook'
import { WalletService } from '@/lib/scrypt/providers'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const CAT20SellArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/cat20Sell.json')

CAT20Sell.loadArtifact(CAT20SellArtifact)

interface SellParams {
	token: TokenMetadata
	price: number
	amount: number
}

export async function buildSellTx(
	params: SellParams,
	feeRate: number,
	utxos: UTXO[],
	wallet: WalletService
): Promise<ResponseData | undefined> {
	const walletAddress = await wallet.getAddress()
	const walletXOnlyPublicKey = await wallet.getXOnlyPublicKey()

	const sellContract = new CAT20Sell(
		// 5120 + CAT Token PubKey
		'5120fdc45725edcc1023ae2a36f5e67485ba1bb1cdc290b92421f629cf1c24c64585',
		btc.Script.fromAddress(walletAddress).toHex(),
		hash160(walletXOnlyPublicKey),
		100000000n
	)

	const sellTaproot = TaprootSmartContract.create(sellContract)

	console.log('send tokens to:', sellTaproot.contractScriptHash)
	console.log('deploy contract to:', sellTaproot.lockingScriptHex)
	console.log('xAddress:', hash160(sellTaproot.lockingScriptHex))

	// Create contract tx

	const contractTx = new btc.Transaction()
		.from(utxos)
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 330,
				script: sellTaproot.lockingScriptHex
			})
		)
		.feePerByte(feeRate)
		.change(walletAddress)

	const contractPsbt = await psbtFromTx(contractTx, utxos, wallet)

	const transferTx = new btc.Transaction()
		.from(utxos)
		.addOutput()
		.feePerByte(feeRate)
		.change(walletAddress)

	return {
		contractPsbt: Buffer.from(contractPsbt.toPSBT()).toString('hex'),
		transferPsbt: Buffer.from(transferTx.toPSBT()).toString('hex')
	}
}

type ResponseData = {
	contractPsbt?: string
	transferPsbt?: string
	message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	try {
		const payload = req.body
		const wallet = new WalletService(payload.address, payload.publicKey)

		const response = await buildSellTx(payload, payload.feeRate, payload.utxos, wallet)

		if (!response) {
			return res.status(500).json({ message: 'Failed to create PSBT' })
		}

		res.status(200).json(response)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}
