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
					.slice(0, 1)
			}

			// const { mintNow } = await import('@/lib/mint')
			// const psbtData = await mintNow(payload)

			// const commitPsbt =
			// 	'70736274ff0100b402000000011464af2669b5bb63fa3569b5f21d42c6ad70e515520d4d909c41048fae190e420300000000fdffffff032202000000000000225120442b62e215cd7d568b5d89a403eb29a9dff9f2333cf3fb014091826f5b9920393b5e030000000000225120889bbc448cc3cf86158540a0be5c69ffee15be74c74570b4d99175963f93b960f1a1899000000000225120889bbc448cc3cf86158540a0be5c69ffee15be74c74570b4d99175963f93b960000000000001012b5cdd8f9000000000225120889bbc448cc3cf86158540a0be5c69ffee15be74c74570b4d99175963f93b96001030401000000011720889bbc448cc3cf86158540a0be5c69ffee15be74c74570b4d99175963f93b96000000000'
			// const revealPsbt =
			// 	'70736274ff0100aa0200000002586121b5f099152c7edc686095267552749be6af641c53ce582c3dc53f80e3cd0000000000fdffffff586121b5f099152c7edc686095267552749be6af641c53ce582c3dc53f80e3cd0100000000fdffffff0200000000000000001a6a1863617401ee5c7912886c96dc346be150a92bf0efd1b798904b01000000000000225120dd9891a63e430a7099ea6122c9329e14e68c62e77949d8becc02717b3d2f3e60000000000001012b2202000000000000225120442b62e215cd7d568b5d89a403eb29a9dff9f2333cf3fb014091826f5b9920390108f308146a6670d6a2215c7d76fba0cb7cd1dcdbc75fffe50000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007520889bbc448cc3cf86158540a0be5c69ffee15be74c74570b4d99175963f93b960ad6d6d750063036361745146a6646e616d656c447261676f6e446f6c6c61726673796d626f6c62444468646563696d616c7302656c696d6974c24203e8636d6178c24401406f40677072656d696e65c24100685121c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac02215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac021367049371d96adb1b1ba2306225c15355743a35c0e5d1149b7c87e1512516939c00001012b3b5e030000000000225120889bbc448cc3cf86158540a0be5c69ffee15be74c74570b4d99175963f93b960000000'

			const {
				data: { commitPsbt, revealPsbt }
			} = await axios.post('/api/deploy', payload)

			console.log('commitPsbt', commitPsbt)
			console.log('revealPsbt', revealPsbt)

			const signedCommitPsbtHex = await window.unisat.signPsbt(commitPsbt)

			const signedCommitPsbt = Transaction.fromPSBT(Buffer.from(signedCommitPsbtHex, 'hex'))

			console.log('commitPsbt', signedCommitPsbt)

			const rawtx = Buffer.from(signedCommitPsbt.extract()).toString('hex')

			const txid = await broadcast(rawtx)
			console.log('txid', txid)

			if (txid instanceof Error) {
				// @ts-ignore
				const message = txid.response.data

				// Show error toast
				toast({
					title: 'Failed to Broadcast',
					// @ts-ignore
					description: message,
					variant: 'destructive'
				})

				return
			}

			const commitTxid = Buffer.from(signedCommitPsbt.id, 'hex')

			const p = Transaction.fromPSBT(Buffer.from(revealPsbt, 'hex'))

			// @ts-ignore
			p.inputs[0].txid = commitTxid
			// @ts-ignore
			p.inputs[1].txid = commitTxid

			await new Promise(r => setTimeout(r, 5000))

			const signedRevealPsbtHex = await window.unisat.signPsbt(
				Buffer.from(p.toPSBT()).toString('hex')
			)

			const signedRevealPsbt = Transaction.fromPSBT(Buffer.from(signedRevealPsbtHex, 'hex'))

			const revealRawtx = Buffer.from(signedRevealPsbt.extract()).toString('hex')

			console.log('revealPsbt', signedRevealPsbt)

			const revealTxid = await broadcast(revealRawtx)
			console.log('revealTxid', revealTxid)

			if (revealTxid instanceof Error) {
				// @ts-ignore
				const message = revealTxid.response.data

				// Show error toast
				toast({
					title: 'Failed to Broadcast',
					// @ts-ignore
					description: message,
					variant: 'destructive'
				})

				return
			}

			// Show success toast with explorer link using shadcn Button
			toast({
				title: 'Transaction Broadcasted!',
				description: 'Your cat20 token is in the mempool',
				action: (
					<Button asChild>
						<a href={`${EXPLORER_URL}/tx/${revealTxid}`} target="_blank" rel="noopener noreferrer">
							View Transaction
						</a>
					</Button>
				)
			})

			window.open(`/token/${revealTxid}_0`, '_blank')
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
