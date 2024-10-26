import { useState } from 'react'
import {
	btc,
	getTokenContractP2TR,
	toP2tr,
	TokenMetadata,
	TokenContract,
	parseTokenMetadata,
	script2P2TR
} from '@/lib/scrypt/common'
import { UTXO, hash160, ByteString } from 'scrypt-ts'
import { BurnGuard, TransferGuard, CAT20 } from '@/lib/scrypt/contracts/dist'
import { CatTx, TaprootSmartContract } from '@/lib/scrypt/contracts/dist/lib/catTx'
import { WalletService } from '@/lib/scrypt/providers/unisatWalletService'
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'
import { TokenData } from '@/hooks/use-token'
import { useTokenUtxos } from '@/hooks/use-token-utxos'
import { FXPCat20Buy } from '@/lib/scrypt/contracts/dist'
import { getOrderbookScript } from './use-sell'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const FXPCAT20BuyArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPCat20Buy.json')
FXPCat20Buy.loadArtifact(FXPCAT20BuyArtifact)

export async function createBuyContract(
	wallet: WalletService,
	feeUtxo: UTXO | UTXO[],
	feeRate: number,
	tokenP2TR: string,
	changeAddress: btc.Address,
	price: bigint,
	amount: bigint,
	sellerAddress?: btc.Address
) {
	const walletXOnlyPublicKey = sellerAddress
		? btc.Script.fromAddress(sellerAddress)
				.getPublicKeyHash()
				.toString('hex')
		: await wallet.getXOnlyPublicKey()

	const args = [tokenP2TR, hash160(walletXOnlyPublicKey), price]

	const orderbookLockingScript = getOrderbookScript({
		args,
		md5: FXPCAT20BuyArtifact.md5
	})
	const { p2tr: orderbookP2TR } = script2P2TR(Buffer.from(orderbookLockingScript, 'hex'))

	const buyContract = TaprootSmartContract.create(
		new FXPCat20Buy(args[0] as ByteString, args[1] as ByteString, args[2] as bigint, false)
	)

	const catTx = CatTx.create()
	catTx.tx.from(feeUtxo)

	const sats = price * amount
	const atIndex = catTx.addContractOutput(buyContract.lockingScriptHex, Number(sats))
	const atOrderbookIndex = catTx.addContractOutput(orderbookP2TR, 330)
	catTx.tx.change(changeAddress).feePerByte(feeRate)
	// Disables tx locktime
	catTx.tx.inputs.forEach((i: any) => {
		i.sequenceNumber = 0xffffffff
	})
	catTx.tx.nLockTime = Number(price)

	if (catTx.tx.getChangeOutput() === null) {
		console.error('Insufficient satoshis balance!')
		return null
	}

	await wallet.signFeeInput(catTx.tx)

	const orderbook = {
		utxo: {
			txId: catTx.tx.id,
			outputIndex: atOrderbookIndex,
			script: catTx.tx.outputs[atOrderbookIndex].script.toHex(),
			satoshis: catTx.tx.outputs[atOrderbookIndex].satoshis
		},
		lockingScript: orderbookLockingScript,
		...script2P2TR(Buffer.from(orderbookLockingScript, 'hex'))
	}

	return {
		catTx: catTx,
		buyContract,
		atOutputIndex: atIndex,
		orderbook
	}
}

export async function sendToken(
	wallet: WalletService,
	feeUtxos: UTXO[],
	feeRate: number,
	metadata: TokenMetadata,
	changeAddress: btc.Address,
	amount: bigint,
	price: bigint
): Promise<{
	commitTx: btc.Transaction
	revealTx: btc.Transaction
} | null> {
	const minterP2TR = toP2tr(metadata.minterAddr)

	const { p2tr: tokenP2TR } = getTokenContractP2TR(minterP2TR)

	const commitResult = await createBuyContract(
		wallet,
		feeUtxos[0],
		feeRate,
		tokenP2TR,
		changeAddress,
		price,
		amount
	)

	if (commitResult === null) {
		return null
	}

	const { catTx, orderbook } = commitResult

	const newFeeUtxo = feeUtxos[1]
	// const newFeeUtxo = {
	// 	txId: catTx.tx.id,
	// 	outputIndex: catTx.tx.outputs.length - 1,
	// 	script: catTx.tx.outputs[catTx.tx.outputs.length - 1].script.toHex(),
	// 	satoshis: catTx.tx.outputs[catTx.tx.outputs.length - 1].satoshis
	// }

	const revealTx = new btc.Transaction()
		.from([orderbook.utxo, newFeeUtxo])
		.change(changeAddress)
		.feePerByte(feeRate)

	revealTx.inputs.forEach((i: any) => {
		i.sequenceNumber = 0xffffffff
	})
	revealTx.nLockTime = 21380

	const vsize = 212
	const changeSats = revealTx.inputAmount - vsize * feeRate
	revealTx.outputs[0].satoshis = changeSats

	const signOrderbook = () => {
		const witnesses = []
		witnesses.push(Buffer.from(orderbook.lockingScript, 'hex'))
		witnesses.push(Buffer.from(orderbook.cblock, 'hex'))
		revealTx.inputs[0].witnesses = witnesses
	}
	signOrderbook()
	await wallet.signFeeInput(revealTx)

	return {
		commitTx: catTx.tx,
		revealTx
	}
}

export function calcTotalAmount(tokens: TokenContract[]) {
	return tokens.reduce((acc, t) => acc + t.state.data.amount, 0n)
}

export function useBuyCat20(token: TokenData) {
	const [isTransferring, setIsTransferring] = useState(false)
	const { toast } = useToast()
	const { totalAmount } = useTokenUtxos(token)

	const handleBuy = async (transferAmount: string, transferAddress: string, price: string) => {
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

			const priceNumber = Number(price)
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

			// Scale the price to satoshis and adjust for token decimals
			const scaledPrice = BigInt(Math.round((priceNumber * 1e8) / Math.pow(10, token.decimals)))

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

			if (bitcoinUtxos.length < 2) {
				toast({
					title: 'Insufficient UTXOs',
					description: 'You need at least 2 UTXOs to create a buy order. Try splitting your utxos.',
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
				payload.utxos,
				payload.feeRate,
				parseTokenMetadata(token),
				btc.Address.fromString(payload.receiver),
				scaledAmount,
				scaledPrice
			)

			if (!response) {
				throw new Error('Failed to create PSBT')
			}

			const { commitTx, revealTx } = response

			const commitTxId = await broadcast(commitTx.uncheckedSerialize())

			if (commitTxId instanceof Error) {
				toast({
					title: 'Failed to Broadcast',
					// @ts-ignore
					description: commitTxId.response.data,
					variant: 'destructive'
				})
				return
			}

			const revealTxid = await broadcast(revealTx.uncheckedSerialize())

			if (revealTxid instanceof Error) {
				toast({
					title: 'Failed to Broadcast',
					// @ts-ignore
					description: revealTxid.response.data,
					variant: 'destructive'
				})
				return
			}

			toast({
				title: 'Transaction Broadcasted!',
				description: 'Your cat20 buy order is in the mempool',
				action: (
					<Button asChild>
						<a href={`${EXPLORER_URL}/tx/${commitTxId}`} target="_blank" rel="noopener noreferrer">
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

	return { isTransferring, handleBuy, totalAmount }
}
