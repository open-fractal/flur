import { useState } from 'react'
import { Transaction } from '@scure/btc-signer'
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { getFeeRate, broadcast } from '@/lib/utils'

export function useSplit() {
	const [isSplitting, setIsSplitting] = useState(false)
	const { toast } = useToast()

	const splitUtxos = async (utxos: any[], feeRate: number, splitCount: number, minSats: number) => {
		const tx = new Transaction()

		// Sort UTXOs by satoshis in descending order
		utxos.sort((a, b) => b.satoshis - a.satoshis)

		let totalInput = 0
		let inputCount = 0

		// Calculate total amount needed and add inputs
		const totalNeeded = splitCount * minSats
		for (const utxo of utxos) {
			if (totalInput >= totalNeeded) break
			tx.addInput({
				txid: utxo.txid,
				index: utxo.vout,
				witnessUtxo: {
					script: Buffer.from(utxo.scriptPk, 'hex'),
					amount: BigInt(utxo.satoshis)
				}
			})
			totalInput += utxo.satoshis
			inputCount++
		}

		const feeAddress = process.env.NEXT_PUBLIC_FEE_ADDRESS
		const feeSats = process.env.NEXT_PUBLIC_FEE_SATS
			? parseInt(process.env.NEXT_PUBLIC_FEE_SATS)
			: undefined

		// Calculate fees and output amount
		const txSize = 41 + splitCount * 43 + inputCount * 58 + (feeAddress ? 34 : 0)
		const fee = BigInt(Math.ceil(txSize * feeRate))
		let totalOutputAmount = BigInt(totalInput) - fee

		let feeOutput = 0n
		if (feeAddress && feeSats) {
			feeOutput = BigInt(feeSats)
			totalOutputAmount -= feeOutput
		}

		const outputAmount = totalOutputAmount / BigInt(splitCount)

		// Ensure output amount is at least minSats
		if (outputAmount < BigInt(minSats)) {
			throw new Error(
				`Insufficient funds to create ${splitCount} outputs of at least ${minSats} satoshis each`
			)
		}

		// Add split outputs
		for (let i = 0; i < splitCount; i++) {
			tx.addOutput({
				script: Buffer.from(utxos[0].scriptPk, 'hex'),
				amount: outputAmount
			})
		}

		// Add fee output as the last output if FEE_ADDRESS is set
		if (feeAddress && feeSats) {
			const { toP2tr } = await import('@/lib/scrypt/common/utils')
			const feeScript = toP2tr(feeAddress)

			tx.addOutput({
				script: feeScript,
				amount: feeOutput
			})
		}

		const psbt = Buffer.from(tx.toPSBT()).toString('hex')
		const signedPsbtHex = await window.unisat.signPsbt(psbt)
		const signedPsbt = Transaction.fromPSBT(Buffer.from(signedPsbtHex, 'hex'))
		const splitRawtx = Buffer.from(signedPsbt.extract()).toString('hex')
		const splitTxid = await broadcast(splitRawtx)

		return splitTxid
	}

	const handleSplit = async (splitCount: number, minSats: number) => {
		// Check if Unisat wallet is connected
		if (!window.unisat || !(await window.unisat.getAccounts()).length) {
			toast({
				title: 'Wallet Not Connected',
				description: 'Please connect your Unisat wallet to split UTXOs.',
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
				description: 'Please use a P2TR (Taproot) address to split UTXOs.',
				variant: 'destructive'
			})
			return
		}

		setIsSplitting(true)

		try {
			const feeRate = await getFeeRate()
			const utxos = await window.unisat.getBitcoinUtxos()

			// Check if there are any UTXOs available
			if (!utxos || utxos.length === 0) {
				toast({
					title: 'Insufficient Balance',
					description: 'You do not have enough balance to split UTXOs.',
					variant: 'destructive'
				})
				setIsSplitting(false)
				return
			}

			// Perform UTXO splitting
			toast({
				title: 'Splitting UTXOs',
				description: `Preparing your wallet to split into ${splitCount} UTXOs of at least ${minSats} satoshis each...`
			})
			const splitTxid = await splitUtxos(utxos, feeRate, splitCount, minSats)

			toast({
				title: 'Transaction Broadcasted!',
				description: 'Your split transaction has been broadcasted.',
				action: (
					<Button asChild>
						<a href={`${EXPLORER_URL}/tx/${splitTxid}`} target="_blank" rel="noopener noreferrer">
							View Transaction
						</a>
					</Button>
				)
			})

			// Show success toast with explorer link using shadcn Button
		} catch (error) {
			console.error('Splitting failed:', error)

			// Show error toast
			toast({
				title: 'Splitting Failed',
				description:
					error instanceof Error
						? // @ts-ignore
						  ('response' in error && error.response?.data?.message) || error.message
						: 'An unexpected error occurred while splitting your UTXOs.',
				variant: 'destructive'
			})
		} finally {
			setIsSplitting(false)
		}
	}

	return { isSplitting, handleSplit }
}
