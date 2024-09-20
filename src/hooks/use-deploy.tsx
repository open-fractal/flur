import { useState } from 'react'
import axios from 'axios' // Add this import at the top of the file
import { Transaction } from '@scure/btc-signer' // Or whatever library you're using for Bitcoin transactions
import { EXPLORER_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'

export function useDeploy() {
	const [isDeploying, setIsDeploying] = useState(false)
	const { toast } = useToast()

	const handleDeploy = async (params: any) => {
		// Check if Unisat wallet is connected
		if (!window.unisat || !(await window.unisat.getAccounts()).length) {
			toast({
				title: 'Wallet Not Connected',
				description: 'Please connect your Unisat wallet to deploy tokens.',
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
				description: 'Please use a P2TR (Taproot) address to deploy tokens.',
				variant: 'destructive'
			})
			return
		}

		setIsDeploying(true)

		try {
			const feeRate = await getFeeRate()

			const utxos = await window.unisat.getBitcoinUtxos()

			// Check if there are any UTXOs available
			if (!utxos || utxos.length === 0) {
				toast({
					title: 'Insufficient Balance',
					description: 'You do not have enough balance to mint tokens.',
					variant: 'destructive'
				})
				setIsDeploying(false)
				return
			}

			const payload = {
				params: params,
				feeRate: feeRate,
				publicKey: await window.unisat.getPublicKey(),
				address: (await window.unisat.getAccounts())[0],
				utxos: utxos
					.map((utxo: any) => ({
						txId: utxo.txid,
						outputIndex: utxo.vout,
						script: utxo.scriptPk,
						satoshis: utxo.satoshis
					}))
					.slice(0, 5)
			}

			// const { mintNow } = await import('@/lib/mint')
			// const psbtData = await mintNow(payload)

			const { data: psbtData } = await axios.post('/api/deploy', payload)
			console.log('psbtData', psbtData)

			const signedPsbtHex = await window.unisat.signPsbts([
				psbtData.commitPsbt,
				psbtData.revealPsbt
			])

			const signedPsbt = Transaction.fromPSBT(Buffer.from(signedPsbtHex, 'hex'))
			const rawtx = Buffer.from(signedPsbt.extract()).toString('hex')

			const txid = await broadcast(rawtx)
			console.log('txid', txid)

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

					// TODO: Check if the UTXO is already spent, get its fee, and create a new tx with a higher fee to replace it

					console.log('signedPsbt', signedPsbt)
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
			setIsDeploying(false)
		}
	}

	return { isDeploying, handleDeploy }
}
