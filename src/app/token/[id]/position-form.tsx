'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TokenData } from '@/hooks/use-token'
import { useBalance } from '@/hooks/use-balance'
import { useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { getFeeRate } from '@/lib/utils' // Add this import
import { Transaction } from '@scure/btc-signer'
import { EXPLORER_URL } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

// Update the FormSchema to allow for number type for price and amount
const FormSchema = z.object({
	price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
	amount: z.coerce.number().min(0, { message: 'Amount must be a positive number' })
})

interface PositionFormProps {
	token: TokenData
}

export function PositionForm({ token }: PositionFormProps) {
	const { fbBalance, tokenBalance, tokenSymbol } = useBalance(token)

	// Update default values for both forms
	const buyForm = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			price: 1, // Default price set to 1
			amount: 0
		}
	})

	const sellForm = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			price: 1, // Default price set to 1
			amount: 0
		}
	})

	// Add state for sliders
	const [buySliderValue, setBuySliderValue] = React.useState(0)
	const [sellSliderValue, setSellSliderValue] = React.useState(0)

	// Effect to update buy amount based on slider
	useEffect(() => {
		const price = buyForm.getValues('price')
		if (price > 0) {
			const maxBuyAmount = parseFloat(fbBalance) / price
			const amount = Number(((maxBuyAmount * buySliderValue) / 100).toFixed(8))
			buyForm.setValue('amount', amount)
		}
	}, [buySliderValue, buyForm, fbBalance])

	// Effect to update sell amount based on slider
	useEffect(() => {
		const amount = Number(((parseFloat(tokenBalance) * sellSliderValue) / 100).toFixed(8))
		sellForm.setValue('amount', amount)
	}, [sellSliderValue, sellForm, tokenBalance])

	const { toast } = useToast()

	const [isSelling, setIsSelling] = React.useState(false)
	const [sellError, setSellError] = React.useState<string | null>(null)

	async function onBuySubmit(data: z.infer<typeof FormSchema>) {
		console.log('Buy submitted:', data)
		// Handle buy submission
	}

	async function onSellSubmit(data: z.infer<typeof FormSchema>) {
		setIsSelling(true)
		setSellError(null)

		// Check if Unisat wallet is connected
		if (!window.unisat || !(await window.unisat.getAccounts()).length) {
			toast({
				title: 'Wallet Not Connected',
				description: 'Please connect your Unisat wallet to sell tokens.',
				variant: 'destructive',
				action: <Button onClick={() => window.unisat.requestAccounts()}>Connect Wallet</Button>
			})
			setIsSelling(false)
			return
		}

		try {
			const address = (await window.unisat.getAccounts())[0]
			const publicKey = await window.unisat.getPublicKey()
			const feeRate = await getFeeRate()
			const utxos = await window.unisat.getBitcoinUtxos()

			// Check if there are any UTXOs available
			if (!utxos || utxos.length === 0) {
				toast({
					title: 'Insufficient Balance',
					description: 'You do not have enough balance to sell tokens.',
					variant: 'destructive'
				})
				setIsSelling(false)
				return
			}

			const payload = {
				token: token,
				price: data.price,
				amount: data.amount,
				address: address,
				publicKey: publicKey,
				feeRate: feeRate,
				utxos: utxos
					.map((utxo: any) => ({
						txId: utxo.txid,
						outputIndex: utxo.vout,
						script: utxo.scriptPk,
						satoshis: utxo.satoshis
					}))
					.slice(0, 1) // Using only the first UTXO, adjust as needed
			}

			const response = await axios.post('/api/sell', payload)

			if (response.status === 200) {
				const { contractPsbt: psbt } = response.data

				// Sign the PSBT with Unisat
				const signedPsbtHex = await window.unisat.signPsbt(psbt)

				// Extract and broadcast the transaction
				const signedPsbt = Transaction.fromPSBT(Buffer.from(signedPsbtHex, 'hex'))
				const rawTx = Buffer.from(signedPsbt.extract()).toString('hex')
				console.log(rawTx)

				const txid = 'bbf303a94a6245bdb9d259939eafe548256b3cacbc8ca5d1ad9c9b90c702aa35'
				// const txid = await broadcast(rawTx)
				// if (txid instanceof Error) {
				// 	throw new Error(`Failed to broadcast: ${txid.message}`)
				// }

				console.log('Sell order placed successfully:', txid)
				sellForm.reset()
				toast({
					title: 'Sell Order Placed',
					description: 'Your sell order has been placed and broadcasted successfully.',
					action: (
						<Button asChild>
							<a href={`${EXPLORER_URL}/tx/${txid}`} target="_blank" rel="noopener noreferrer">
								View Transaction
							</a>
						</Button>
					)
				})
			} else {
				throw new Error('Invalid response from server')
			}
		} catch (error) {
			console.error('Error placing sell order:', error)
			setSellError(error instanceof Error ? error.message : 'An unexpected error occurred')
		} finally {
			setIsSelling(false)
		}
	}

	return (
		<div className="w-full max-w-4xl text-white p-4 border-t">
			<div className="flex space-x-4">
				{/* Buy Form */}
				<Form {...buyForm}>
					<form onSubmit={buyForm.handleSubmit(onBuySubmit)} className="flex-1 space-y-3">
						<FormField
							control={buyForm.control}
							name="price"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel>Buy Price (FB)</FormLabel>
									<FormControl>
										<Input placeholder="0.00" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={buyForm.control}
							name="amount"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel>Buy Amount ({token.symbol})</FormLabel>
									<FormControl>
										<Input placeholder="0.00" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Slider
							value={[buySliderValue]}
							onValueChange={value => setBuySliderValue(value[0])}
							max={100}
							step={1}
							className="my-6"
						/>
						<div className="flex justify-between text-xs text-gray-400">
							<span>Available</span>
							<span>{fbBalance} FB</span>
						</div>
						<div className="flex justify-between text-xs text-gray-400">
							<span>Max Buy</span>
							<span>-- {token.symbol}</span>
						</div>
						<Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
							Buy {token.symbol}
						</Button>
					</form>
				</Form>

				{/* Sell Form */}
				<Form {...sellForm}>
					<form onSubmit={sellForm.handleSubmit(onSellSubmit)} className="flex-1 space-y-3">
						<FormField
							control={sellForm.control}
							name="price"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel>Sell Price (FB)</FormLabel>
									<FormControl>
										<Input placeholder="0.00" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={sellForm.control}
							name="amount"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel>Sell Amount ({token.symbol})</FormLabel>
									<FormControl>
										<Input placeholder="0.00" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Slider
							value={[sellSliderValue]}
							onValueChange={value => setSellSliderValue(value[0])}
							max={100}
							step={1}
							className="my-6"
						/>
						<div className="flex justify-between text-xs text-gray-400">
							<span>Available</span>
							<span>
								{tokenBalance} {tokenSymbol}
							</span>
						</div>
						<div className="flex justify-between text-xs text-gray-400">
							<span>Max Sell</span>
							<span>-- FB</span>
						</div>
						{sellError && <div className="text-red-500 text-sm">{sellError}</div>}
						<Button
							type="submit"
							className="w-full bg-red-500 hover:bg-red-600"
							disabled={isSelling}
						>
							{isSelling ? 'Placing Order...' : `Sell ${token.symbol}`}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
