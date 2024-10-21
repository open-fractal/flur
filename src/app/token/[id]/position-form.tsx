'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TokenData } from '@/hooks/use-token'
import { useBalance } from '@/hooks/use-balance'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSellCat20 } from '@/hooks/use-sell' // Add this import
import { useBuyCat20 } from '@/hooks/use-buy' // Add this import
import { useTakeBuyCat20 } from '@/hooks/use-take-buy' // Add this import
import { useTakeSellCat20 } from '@/hooks/use-take-sell' // Add this import
import { useTokenOrderbook } from '@/hooks/use-token-orderbook'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

// Update the FormSchema to include the total value check
const FormSchema = z
	.object({
		price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
		amount: z.coerce.number().min(0, { message: 'Amount must be a positive number' })
	})
	.refine(data => data.price * data.amount <= 21.47483647, {
		message: 'Total value (amount * price) cannot exceed 21.47483647',
		path: ['amount'] // This will show the error on the amount field
	})

interface PositionFormProps {
	token: TokenData
	selectedOrder: { price: number; isBuy: boolean; amount: number } | null
}

export function PositionForm({ token, selectedOrder }: PositionFormProps) {
	const { fbBalance, tokenBalance, tokenSymbol } = useBalance(token)
	const { isTransferring, handleSell, totalAmount } = useSellCat20(token) // Add this line
	const { handleBuy } = useBuyCat20(token) // Add this line
	const { isTransferring: isTakingSell, handleTakeSell } = useTakeSellCat20(token) // Add this line
	const { handleTakeBuy } = useTakeBuyCat20(token) // Add this line

	const {
		sellOrders,
		buyOrders,
		isLoading: isOrderbookLoading,
		isError: isOrderbookError
	} = useTokenOrderbook(token)

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

	const [isBuying, setIsBuying] = React.useState(false)
	const [buyError, setBuyError] = React.useState<string | null>(null)

	// Update the form when selectedOrder changes
	useEffect(() => {
		if (selectedOrder) {
			const { price, isBuy, amount } = selectedOrder
			if (isBuy) {
				// Updating sell form for buy orders (user is selling to meet the buy order)
				sellForm.reset({
					price: price,
					amount: amount
				})
				// Calculate and set the slider value
				const sliderValue = Math.min((amount / parseFloat(tokenBalance)) * 100, 100)
				setSellSliderValue(sliderValue)

				// Reset buy form
				buyForm.reset({
					price: 1,
					amount: 0
				})
				setBuySliderValue(0)
			} else {
				// Updating buy form for sell orders (user is buying to meet the sell order)
				buyForm.reset({
					price: price,
					amount: amount
				})
				// Calculate and set the slider value
				const maxBuyAmount = parseFloat(fbBalance) / price
				const sliderValue = Math.min((amount / maxBuyAmount) * 100, 100)
				setBuySliderValue(sliderValue)

				// Reset sell form
				sellForm.reset({
					price: 1,
					amount: 0
				})
				setSellSliderValue(0)
			}
		}
	}, [selectedOrder, buyForm, sellForm, fbBalance, tokenBalance])

	const matchingSellOrder = (() => {
		const buyPrice = buyForm.watch('price')
		const buyAmount = buyForm.watch('amount')

		return sellOrders.find(
			order =>
				(parseFloat(order.price) * Math.pow(10, token.decimals)) / 1e8 <= buyPrice &&
				parseInt(order.tokenAmount) / Math.pow(10, token.decimals) >= buyAmount
		)
	})()

	const matchingBuyOrder = (() => {
		const sellPrice = sellForm.watch('price')
		const sellAmount = sellForm.watch('amount')

		return buyOrders.find(
			order =>
				(parseFloat(order.price) * Math.pow(10, token.decimals)) / 1e8 >= sellPrice &&
				parseInt(order.tokenAmount) / Math.pow(10, token.decimals) >= sellAmount
		)
	})()

	async function onBuySubmit(data: z.infer<typeof FormSchema>) {
		setIsBuying(true)
		setBuyError(null)

		try {
			// Check if Unisat wallet is connected
			if (!window.unisat || !(await window.unisat.getAccounts()).length) {
				toast({
					title: 'Wallet Not Connected',
					description: 'Please connect your Unisat wallet to buy tokens.',
					variant: 'destructive',
					action: <Button onClick={() => window.unisat.requestAccounts()}>Connect Wallet</Button>
				})
				return
			}

			// Get the buyer's address
			const address = (await window.unisat.getAccounts())[0]

			if (matchingSellOrder) {
				await handleTakeSell(data.amount.toString(), address, matchingSellOrder)
			} else {
				await handleBuy(data.amount.toString(), address, data.price.toString())
			}
		} catch (error) {
			console.error('Error processing buy order:', error)
			setBuyError(error instanceof Error ? error.message : 'An unexpected error occurred')
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'An unexpected error occurred',
				variant: 'destructive'
			})
		} finally {
			setIsBuying(false)
		}
	}

	async function onSellSubmit(data: z.infer<typeof FormSchema>) {
		setIsSelling(true)
		setSellError(null)

		try {
			// Check if Unisat wallet is connected
			if (!window.unisat || !(await window.unisat.getAccounts()).length) {
				toast({
					title: 'Wallet Not Connected',
					description: 'Please connect your Unisat wallet to sell tokens.',
					variant: 'destructive',
					action: <Button onClick={() => window.unisat.requestAccounts()}>Connect Wallet</Button>
				})
				return
			}

			// Get the seller's address
			const address = (await window.unisat.getAccounts())[0]

			if (matchingBuyOrder) {
				await handleTakeBuy(data.amount.toString(), address, matchingBuyOrder)
			} else {
				await handleSell(data.amount.toString(), address, data.price.toString())
			}
		} catch (error) {
			console.error('Error processing sell order:', error)
			setSellError(error instanceof Error ? error.message : 'An unexpected error occurred')
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'An unexpected error occurred',
				variant: 'destructive'
			})
		} finally {
			setIsSelling(false)
		}
	}

	// Update the function to return an object with value and isTooHigh
	const calculateTotalValue = (price: number, amount: number) => {
		const total = price * amount
		const isTooHigh = total > 21.47483647
		return {
			value: isTooHigh ? 'Too High' : total.toFixed(8),
			isTooHigh
		}
	}

	return (
		<div className="w-full max-w-4xl text-white p-4 border-t">
			{isOrderbookLoading && <p>Loading orderbook...</p>}
			{isOrderbookError && <p>Error loading orderbook. Please try again.</p>}
			{!isOrderbookLoading && !isOrderbookError && (
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
							{buyError && <div className="text-red-500 text-sm">{buyError}</div>}
							<div className="flex justify-between text-xs">
								<span className="text-gray-400">Total Value (FB)</span>
								{(() => {
									const { value, isTooHigh } = calculateTotalValue(
										buyForm.watch('price'),
										buyForm.watch('amount')
									)
									return (
										<span className={isTooHigh ? 'text-red-500 font-bold' : 'text-gray-400'}>
											{value}
										</span>
									)
								})()}
							</div>
							<Button
								type="submit"
								className="w-full bg-green-500 hover:bg-green-600"
								disabled={isTakingSell || isBuying || isOrderbookLoading}
							>
								{isTakingSell || isBuying
									? matchingSellOrder
										? `Buying ${token.symbol}`
										: 'Creating Buy Order...'
									: matchingSellOrder
									? `Buy ${buyForm.watch('amount')} ${token.symbol}`
									: 'Create Buy Order'}
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
							{sellError && <div className="text-red-500 text-sm">{sellError}</div>}
							<div className="flex justify-between text-xs">
								<span className="text-gray-400">Total Value (FB)</span>
								{(() => {
									const { value, isTooHigh } = calculateTotalValue(
										sellForm.watch('price'),
										sellForm.watch('amount')
									)
									return (
										<span className={isTooHigh ? 'text-red-500 font-bold' : 'text-gray-400'}>
											{value}
										</span>
									)
								})()}
							</div>
							<Button
								type="submit"
								className="w-full bg-red-500 hover:bg-red-600"
								disabled={isTransferring || isSelling}
							>
								{isTransferring || isSelling
									? 'Placing Order...'
									: matchingBuyOrder
									? `Sell ${token.symbol}`
									: `Create Sell Order`}
							</Button>
						</form>
					</Form>
				</div>
			)}
		</div>
	)
}
