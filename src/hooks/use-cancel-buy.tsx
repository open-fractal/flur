import { useState } from 'react'
import {
	btc,
	getDummySigner,
	getDummyUTXO,
	toTokenAddress,
	getTokenContractP2TR,
	toP2tr,
	getRawTransaction,
	TokenMetadata,
	CHANGE_MIN_POSTAGE,
	parseTokenMetadata
} from '@/lib/scrypt/common'
import {
	int2ByteString,
	MethodCallOptions,
	toByteString,
	UTXO,
	PubKey,
	ByteString
} from 'scrypt-ts'
import { BurnGuard, TransferGuard, CAT20 } from '@/lib/scrypt/contracts/dist'
import { CatTx } from '@/lib/scrypt/contracts/dist/lib/catTx'
import { getTxCtxMulti, ChangeInfo, MAX_INPUT } from '@cat-protocol/cat-smartcontracts'
import { WalletService } from '@/lib/scrypt/providers/unisatWalletService'
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'
import { TokenData } from '@/hooks/use-token'
import { useTokenUtxos } from '@/hooks/use-token-utxos'
import { FXPCat20Buy } from '@/lib/scrypt/contracts/dist'
import { OrderbookEntry } from './use-token-orderbook'
import { unlockTaprootContractInput } from './use-take-sell'
import { createTakeBuyContract } from './use-take-buy'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact)

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact)

const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact)

const FXPCAT20BuyArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPCat20Buy.json')
FXPCat20Buy.loadArtifact(FXPCAT20BuyArtifact)

const DEFAULTS = {
	verify: false
}

export async function takeToken(
	wallet: WalletService,
	feeUtxos: UTXO[],
	feeRate: number,
	metadata: TokenMetadata,
	changeAddress: btc.Address,
	receiver: btc.Address,
	amount: bigint,
	price: bigint,
	cachedTxs: Map<string, btc.Transaction>,
	selectedOrder: OrderbookEntry
): Promise<{
	revealTx: btc.Transaction
} | null> {
	const buyRawTransaction = await getRawTransaction(selectedOrder.genesisTxid || selectedOrder.txid)
	const buyContractTx = new btc.Transaction(buyRawTransaction)
	const buyContractInputIndex = 0
	const buyContractOuputIndex = selectedOrder.genesisOutputIndex || selectedOrder.outputIndex

	const buyContractUtxo = {
		txId: selectedOrder.txid,
		outputIndex: buyContractOuputIndex,
		script: buyContractTx.outputs[buyContractOuputIndex].script.toHex(),
		satoshis: buyContractTx.outputs[buyContractOuputIndex].satoshis
	}

	const sellerLockingScript = `5120${selectedOrder.ownerPubKey}`

	const minterP2TR = toP2tr(metadata.minterAddr)
	const { p2tr: tokenP2TR } = getTokenContractP2TR(minterP2TR)
	const buyContract = await createTakeBuyContract(tokenP2TR, sellerLockingScript, price)

	if (buyContract.lockingScriptHex !== buyContractUtxo.script) {
		console.log(buyContract.lockingScriptHex, buyContractUtxo.script)
		throw new Error('There was an error creating the buy contract')
	}

	const inputUtxos = [buyContractUtxo, feeUtxos[0]]

	const catTx = CatTx.create()
	catTx.tx.from(inputUtxos)

	catTx.tx
		.addOutput(
			new btc.Transaction.Output({
				satoshis: 0,
				script: btc.Script.fromAddress(changeAddress)
			})
		)
		.feePerByte(feeRate)

	const vsize = 1040

	const satoshiChangeAmount = catTx.tx.inputAmount - vsize * feeRate

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
	// push sell
	inputIndexList.push(buyContractInputIndex)
	scriptBuffers.push(buyContract.tapleafBuffer)
	const ctxList = getTxCtxMulti(catTx.tx, inputIndexList, scriptBuffers)

	const sign = async (sigs: string[]) => {
		// buy unlock
		{
			await buyContract.contract.connect(getDummySigner())
			const { shPreimage, prevoutsCtx, spentScripts } = ctxList[buyContractInputIndex]
			const pubkeyX = await wallet.getXOnlyPublicKey()
			const pubKeyPrefix = await wallet.getPubKeyPrefix()
			const spendAmountCtx: ByteString[] = []

			console.log({ pubkeyX, pubKeyPrefix, sellerLockingScript })
			debugger

			for (let i = 0; i < MAX_INPUT; i++) {
				if (typeof spendAmountCtx[i] === 'undefined') {
					spendAmountCtx.push(toByteString(''))
				}
			}

			const buyCall = await buyContract.contract.methods.take(
				catTx.state.stateHashList,
				0n,
				0n,
				0n,
				toTokenAddress(receiver),
				toByteString('4a01000000000000'),
				0n,
				false,
				true,
				pubKeyPrefix,
				PubKey(pubkeyX),
				() => sigs[0],
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
				buyCall,
				buyContract,
				catTx.tx,
				buyContractTx,
				buyContractInputIndex,
				DEFAULTS.verify,
				true
			)
		}
	}

	const sigs = await wallet.signContract(catTx.tx, buyContract)
	await sign(sigs)

	return {
		revealTx: catTx.tx
	}
}

export function useCancelBuyCat20(token: TokenData) {
	const [isTransferring, setIsTransferring] = useState(false)
	const { toast } = useToast()
	const { totalAmount } = useTokenUtxos(token)

	const handleCancelBuy = async (selectedOrder: OrderbookEntry) => {
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

			const payload = {
				token: token,
				amount: scaledAmount.toString(),
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

			const response = await takeToken(
				wallet,
				payload.utxos,
				payload.feeRate,
				parseTokenMetadata(token),
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

			const { revealTx } = response

			debugger
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

	return { isTransferring, handleCancelBuy, totalAmount }
}
