import { useState } from 'react'
import axios from 'axios' // Add this import at the top of the file
import { Transaction } from '@scure/btc-signer' // Or whatever library you're using for Bitcoin transactions
import { EXPLORER_URL, API_URL } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button' // Add this import at the top of the file
import { getFeeRate, broadcast } from '@/lib/utils'

export function useMint(tokenId: string) {
	const [isMinting, setIsMinting] = useState(false)
	const { toast } = useToast()

	// const { utxoCount } = useMinterUtxoCount(tokenId)

	const handleMint = async (utxoCount?: number, repeatMint: number = 1) => {
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

			const { data: { data: minters } } = await axios.get(`${API_URL}/api/minters/${tokenId}/utxos`)


			if (minters.utxos.length < repeatMint) {
				toast({
					title: 'Minters not available',
					description: `Try set Repeat mint less than: ${minters.utxos.length / 2}`,
					variant: 'destructive'
				})
				setIsMinting(false)
				return
			}

			const mintedIndex: Set<number> = new Set()
			const payloads: any[] = []

			for (let i = 0; i < repeatMint; i++) {
				let minter: any
				while (true) {
					const randomIndex = Math.floor(Math.random() * minters.utxos.length)
					if (mintedIndex.has(randomIndex)) {
						continue
					}
					const mtemp = minters.utxos[randomIndex]
					if (!mtemp) {
						continue
					}

					mintedIndex.add(randomIndex)
					minter = mtemp
					break
				}

				const address = (await window.unisat.getAccounts())[0]
				const pubkey = await window.unisat.getPublicKey()
				payloads.push({
					utxoCount: utxoCount,
					token: tokenData,
					feeRate: feeRate,
					publicKey: pubkey,
					address: address,
					minter: minter,
					utxos: utxos
						.map((utxo: any) => ({
							txId: utxo.txid,
							outputIndex: utxo.vout,
							script: utxo.scriptPk,
							satoshis: utxo.satoshis
						}))
						.slice(i, i + 100)
				})
			}
			// const { mintNow } = await import('@/lib/mint')
			// const psbtData = await mintNow(payload)

			const responses = await Promise.all(payloads.map((payload, index) => {
				return axios.post('/api/mint', payload)
					.then((response) => {
						toast({
							title: `Mint #${index+1} prepared`,
							description:
								'Your mint being prepared for signing.'
						});
						return response;
					})
					.catch((error) => {
						toast({
							title: `Failed to prepare Mint #${index+1}`,
							description: "This mint will be skipped.",
							variant: 'destructive'
						})

						throw error
					})
			}));
			const psbtHexes: string[] = responses.map((response) => response.data.psbt)

			let psbtsLength = psbtHexes.length
			let signedPsbtHexes: string[]

			if (psbtsLength > 1) {
				signedPsbtHexes = await window.unisat.signPsbts(psbtHexes, [])
			} else if (psbtsLength == 1) {
				signedPsbtHexes = [await window.unisat.signPsbt(psbtHexes[0])]
			} else {
				toast({
					title: 'Signing error',
					description: 'Could not sign transactions.',
					variant: 'destructive'
				})
				setIsMinting(false)
				return
			}

			if (signedPsbtHexes.length < 1) {
				setIsMinting(false)
				console.log("minting was canceled")
				return
			}

			for (let i = 0; i < signedPsbtHexes.length; i++) {
				const signedPsbt = Transaction.fromPSBT(Buffer.from(signedPsbtHexes[i], 'hex'))
				const rawtx = Buffer.from(signedPsbt.extract()).toString('hex')

				// leave as is, broadcasting bunch of transactions at once may result into status 426 Too Many Requests
				const txid = await broadcast(rawtx)
				console.log('txid', txid, 'number', i)

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
						title: `Failed to Broadcast Tx #${i+1}`,
						// @ts-ignore
						description: txid.response.data,
						variant: 'destructive'
					})
				} else {
					// Show success toast with explorer link using shadcn Button
					toast({
						title: `Transaction #${i+1} Broadcasted!`,
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
