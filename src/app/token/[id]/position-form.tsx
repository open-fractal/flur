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

// Update the helper function to handle decimals
const calculateMaxAmount = (
	price: number,
	balance: number,
	decimals: number,
	maxTotal: number = 21.47483647
) => {
	// First check how much they could buy/sell based on their balance
	const maxFromBalance = balance
	// Then check how much they could trade before hitting the max total value
	const maxFromTotal = maxTotal / price
	// Get the minimum of the two values
	const maxAmount = Math.min(maxFromBalance, maxFromTotal)
	// Round to the correct number of decimals
	const factor = Math.pow(10, decimals)
	return Math.floor(maxAmount * factor) / factor
}

// Update the formatSignificantDigits function with error handling
const formatSignificantDigits = (value: number | string): string => {
	// Handle invalid inputs
	if (value === null || value === undefined) return '0'

	// Convert string to number if needed
	const numValue = typeof value === 'string' ? parseFloat(value) : value

	// Handle NaN and invalid numbers
	if (isNaN(numValue)) return '0'

	// Handle zero case
	if (numValue === 0) return '0'

	try {
		// Convert to string in exponential notation to analyze significant digits
		const exp = numValue.toExponential()
		const exponent = exp.split('e').map(Number)[1]

		// For very small numbers (< 0.000001), use scientific notation
		if (numValue < 0.000001) {
			return numValue.toExponential(4)
		}

		// For numbers < 1, show necessary decimal places up to 8
		if (numValue < 1) {
			const decimalPlaces = Math.min(8, Math.abs(exponent) + 2)
			return numValue.toFixed(decimalPlaces).replace(/\.?0+$/, '')
		}

		// For numbers >= 1, show up to 8 significant digits
		return Number(numValue.toPrecision(8)).toString()
	} catch (error) {
		console.error('Error formatting number:', error)
		// Return a safe fallback value
		return numValue.toString()
	}
}

// Update the calculateTotalCost function
const calculateTotalCost = (
	price: number,
	amount: number,
	hasServiceFee: boolean,
	tokenSymbol: string,
	isBuyForm: boolean // Add this parameter
) => {
	const serviceFee = hasServiceFee ? 0.01 : 0
	const totalValue = price * amount
	const totalCost = totalValue + serviceFee
	const isTooHigh = totalCost > 21.47483647

	// For buy form, show total in FB
	if (isBuyForm) {
		return {
			value: isTooHigh ? 'Too High' : `${formatSignificantDigits(totalCost)} FB`,
			isTooHigh
		}
	}

	// For sell form, show amount in token symbol
	return {
		value: hasServiceFee
			? `${formatSignificantDigits(amount)} ${tokenSymbol} / ${serviceFee} FB`
			: `${formatSignificantDigits(amount)} ${tokenSymbol}`,
		isTooHigh
	}
}

export function PositionForm({ token, selectedOrder }: PositionFormProps) {
	const { fbBalance, tokenSymbol } = useBalance(token)
	const { isTransferring, handleSell } = useSellCat20(token)
	const { handleBuy } = useBuyCat20(token)
	const {
		isTransferring: isTakingSell,
		handleTakeSell,
		totalAmount: tokenBalance
	} = useTakeSellCat20(token)
	const { handleTakeBuy } = useTakeBuyCat20(token)

	const {
		sellOrders,
		buyOrders,
		isLoading: isOrderbookLoading,
		isError: isOrderbookError
	} = useTokenOrderbook(token)

	// Add state to track if the price has been manually changed
	const [isBuyPriceManual, setIsBuyPriceManual] = React.useState(false)
	const [isSellPriceManual, setIsSellPriceManual] = React.useState(false)

	// Get best prices from orderbook
	const getBestPrices = () => {
		// For buy form, use the highest buy order price (to place just above it)
		const defaultBuyPrice =
			buyOrders.length > 0
				? (parseFloat(buyOrders[0].price) * Math.pow(10, token.decimals)) / 1e8
				: 1
		// For sell form, use the lowest sell order price (to place just below it)
		const defaultSellPrice =
			sellOrders.length > 0
				? (parseFloat(sellOrders[0].price) * Math.pow(10, token.decimals)) / 1e8
				: 1

		return { defaultSellPrice, defaultBuyPrice }
	}

	// Initialize forms with exact orderbook prices
	const { defaultSellPrice, defaultBuyPrice } = getBestPrices()

	const buyForm = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			price: defaultBuyPrice,
			amount: 0
		}
	})

	const sellForm = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			price: defaultSellPrice,
			amount: 0
		}
	})

	// Update prices when orderbook changes
	useEffect(() => {
		const { defaultSellPrice, defaultBuyPrice } = getBestPrices()

		// Only update if there's no selected order and the current value is different
		if (!selectedOrder) {
			const currentBuyPrice = buyForm.getValues('price')
			const currentSellPrice = sellForm.getValues('price')

			if (!isBuyPriceManual && currentBuyPrice !== defaultBuyPrice) {
				buyForm.setValue('price', defaultBuyPrice)
			}
			if (!isSellPriceManual && currentSellPrice !== defaultSellPrice) {
				sellForm.setValue('price', defaultSellPrice)
			}
		}
	}, [sellOrders, buyOrders, isBuyPriceManual, isSellPriceManual])

	// Update the handleBuyPriceChange function to handle empty input
	const handleBuyPriceChange = (value: string) => {
		setIsBuyPriceManual(true)
		const parsedValue = parseFloat(value)
		buyForm.setValue('price', isNaN(parsedValue) ? 0 : parsedValue)
	}

	// Update the handleSellPriceChange function to handle empty input
	const handleSellPriceChange = (value: string) => {
		setIsSellPriceManual(true)
		const parsedValue = parseFloat(value)
		sellForm.setValue('price', isNaN(parsedValue) ? 0 : parsedValue)
	}

	// Add state for sliders
	const [buySliderValue, setBuySliderValue] = React.useState(0)
	const [sellSliderValue, setSellSliderValue] = React.useState(0)

	// Move matchingSellOrder and matchingBuyOrder declarations up here
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

	// Update the buy amount slider effect
	useEffect(() => {
		const price = buyForm.getValues('price')
		if (price > 0) {
			// Calculate max possible amount based on FB balance and max total value
			let maxBuyAmount = calculateMaxAmount(price, parseFloat(fbBalance), token.decimals)

			if (matchingSellOrder) {
				const orderAmount = parseInt(matchingSellOrder.tokenAmount) / Math.pow(10, token.decimals)
				maxBuyAmount = Math.min(maxBuyAmount, orderAmount)
			}

			const amount = Number(((maxBuyAmount * buySliderValue) / 100).toFixed(token.decimals))
			buyForm.setValue('amount', amount)
		}
	}, [buySliderValue, buyForm, fbBalance, matchingSellOrder, token.decimals])

	// Update the sell amount slider effect
	useEffect(() => {
		const price = sellForm.getValues('price')
		if (price > 0) {
			// Calculate max possible amount based on token balance and max total value
			let maxSellAmount = calculateMaxAmount(price, parseFloat(tokenBalance), token.decimals)

			if (matchingBuyOrder) {
				const orderAmount = parseInt(matchingBuyOrder.tokenAmount) / Math.pow(10, token.decimals)
				maxSellAmount = Math.min(maxSellAmount, orderAmount)
			}

			const amount = Number(((maxSellAmount * sellSliderValue) / 100).toFixed(token.decimals))
			sellForm.setValue('amount', amount)
		}
	}, [sellSliderValue, sellForm, tokenBalance, matchingBuyOrder, token.decimals])

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
				// Updating sell form for buy orders
				sellForm.reset({
					price: price,
					amount: amount
				})
				// Calculate slider value based on the minimum of order amount and token balance
				const maxAmount = Math.min(amount, parseFloat(tokenBalance))
				const sliderValue = Math.min((amount / maxAmount) * 100, 100)
				setSellSliderValue(sliderValue)

				// Reset buy form
				buyForm.reset({
					price: 1,
					amount: 0
				})
				setBuySliderValue(0)
			} else {
				// Updating buy form for sell orders
				buyForm.reset({
					price: price,
					amount: amount
				})
				// Calculate slider value based on the minimum of order amount and possible buy amount
				const maxBuyAmount = Math.min(amount, parseFloat(fbBalance) / price)
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
											<Input
												type="number"
												placeholder="0.00"
												step={1 / Math.pow(10, token.decimals)} // Set step based on token decimals
												{...field}
												onChange={e => handleBuyPriceChange(e.target.value)}
											/>
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
										<div className="flex justify-end gap-1 text-[10px]">
											<span className="text-muted-foreground">Available: </span>
											<span className="font-medium text-white">{fbBalance} FB</span>
										</div>
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
							{/* Show either service fee for take orders or network fee for make orders */}
							<div className="space-y-1">
								<div className="flex justify-between text-xs text-gray-400">
									<span>Service Fee</span>
									<span>{matchingSellOrder ? '0.01 FB' : 'Free'}</span>
								</div>
								<div className="flex justify-between text-xs">
									<span className="text-gray-400">Total Cost</span>
									{(() => {
										const { value, isTooHigh } = calculateTotalCost(
											buyForm.watch('price'),
											buyForm.watch('amount'),
											!!matchingSellOrder,
											tokenSymbol,
											true // indicate this is buy form
										)
										return (
											<span className={isTooHigh ? 'text-red-500 font-bold' : 'text-gray-400'}>
												{value}
											</span>
										)
									})()}
								</div>
							</div>
							{buyError && <div className="text-red-500 text-sm">{buyError}</div>}
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
											<Input
												type="number"
												placeholder="0.00"
												step={1 / Math.pow(10, token.decimals)} // Set step based on token decimals
												{...field}
												onChange={e => handleSellPriceChange(e.target.value)}
											/>
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
										<div className="flex justify-end gap-1 text-[10px]">
											<span className="text-muted-foreground">Available: </span>
											<span className="font-medium text-white">
												{tokenBalance} {tokenSymbol}
											</span>
										</div>
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
							{/* Show either service fee for take orders or network fee for make orders */}
							<div className="space-y-1">
								<div className="flex justify-between text-xs text-gray-400">
									<span>Service Fee</span>
									<span>{matchingBuyOrder ? '0.01 FB' : 'Free'}</span>
								</div>
								<div className="flex justify-between text-xs">
									<span className="text-gray-400">Total Cost</span>
									{(() => {
										const { value, isTooHigh } = calculateTotalCost(
											sellForm.watch('price'),
											sellForm.watch('amount'),
											!!matchingBuyOrder,
											tokenSymbol,
											false // indicate this is sell form
										)
										return (
											<span className={isTooHigh ? 'text-red-500 font-bold' : 'text-gray-400'}>
												{value}
											</span>
										)
									})()}
								</div>
							</div>
							{sellError && <div className="text-red-500 text-sm">{sellError}</div>}
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
