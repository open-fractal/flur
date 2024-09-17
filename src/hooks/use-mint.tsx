import { useState } from 'react'
import axios from 'axios' // Add this import at the top of the file
import { Transaction } from '@scure/btc-signer' // Or whatever library you're using for Bitcoin transactions
import { MEMPOOL_URL, EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file

export const getFeeRate = async function(): Promise<number> {
	try {
		const url = `${MEMPOOL_URL}/fees/recommended`
		const response = await axios.get(url)
		const feeRate = response.data

		if (!feeRate) {
			return 2
		}

		return Math.max(2, feeRate['fastestFee'] || 1)
	} catch (error) {
		console.error(`fetch feeRate failed:`, error)
		return 2 // Default fee rate if request fails
	}
}

export async function broadcast(txHex: string): Promise<string | Error> {
	const url = `${MEMPOOL_URL}/tx`
	try {
		const response = await axios.post(url, txHex, {
			headers: {
				'Content-Type': 'text/plain'
			}
		})

		return response.data
	} catch (error) {
		console.error('broadcast failed!', error)
		return error as Error
	}
}

export function useMint(tokenId: string) {
	const [isMinting, setIsMinting] = useState(false)
	const { toast } = useToast()

	const handleMint = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation() // Prevent row click event

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

		setIsMinting(true)

		try {
			const feeRate = await getFeeRate()

			const utxos = await window.unisat.getBitcoinUtxos()

			const { data: pbstData } = await axios.post('/api/mint', {
				tokenId: tokenId, // Use the tokenId passed to useMint
				feeRate: feeRate,
				publicKey: await window.unisat.getPublicKey(),
				address: (await window.unisat.getAccounts())[0],
				utxos: utxos.map((utxo: any) => ({
					txId: utxo.txid,
					outputIndex: utxo.vout,
					script: utxo.scriptPk,
					satoshis: utxo.satoshis
				}))
			})

			console.log('pbstData', pbstData)

			const signedPsbtHex = await window.unisat.signPsbt(pbstData.psbt)

			const signedPsbt = Transaction.fromPSBT(Buffer.from(signedPsbtHex, 'hex'))
			const rawtx = Buffer.from(signedPsbt.extract()).toString('hex')

			const txid = await broadcast(rawtx)
			console.log('txid', txid)

			if (txid instanceof Error) {
				// Show error toast
				toast({
					title: 'Failed to Broadcast',
					// @ts-ignore
					description: txid.response.data,
					variant: 'destructive'
				})
			} else {
				// Show success toast with explorer link using shadcn Button
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
						? error.message
						: 'An unexpected error occurred while minting your token.',
				variant: 'destructive'
			})
		} finally {
			setIsMinting(false)
		}
	}

	return { isMinting, handleMint }
}
