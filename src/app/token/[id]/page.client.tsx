'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { API_URL } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useMint } from '@/hooks/use-mint'
import { TokenHeader } from '@/components/token-header'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { InfoIcon } from 'lucide-react'
import { useWallet, getBitcoinUtxoCount } from '@/lib/unisat'
import { useSplit } from '@/hooks/use-split'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { btcToSats } from '@/lib/utils'

interface TokenResponse {
	code: number
	msg: string
	data: TokenData
}

export interface TokenData {
	minterAddr: string
	tokenAddr: string
	info: {
		max: string
		name: string
		limit: string
		symbol: string
		premine: string
		decimals: number
		minterMd5: string
	}
	tokenId: string
	revealTxid: string
	revealHeight: number
	genesisTxid: string
	name: string
	symbol: string
	decimals: number
	minterPubKey: string
	tokenPubKey: string
	currentSupply: string
	supply: number
	holders: number
}

interface UtxoCountResponse {
	code: number
	msg: string
	data: {
		count: number
	}
}

const fetcher = (url: string) =>
	fetch(url).then(res => {
		if (!res.ok) throw new Error('Network response was not ok')
		return res.json()
	})

const TokenDetail: React.FC<{ token: TokenData }> = ({ token }) => {
	const [error, setError] = useState<string | null>(null)
	const { handleSplit, isSplitting } = useSplit()
	const { isMinting, handleMint } = useMint(token.tokenId)
	const [serviceFee, setServiceFee] = useState<string | null>(null)

	const { data: tokenResponse, error: tokenError } = useSWR<TokenResponse>(
		`${API_URL}/api/tokens/${token.tokenId}?v=1`,
		fetcher,
		{
			refreshInterval: 10000, // Refetch every 10 seconds
			dedupingInterval: 5000 // Dedupe requests within 5 seconds
		}
	)

	const tokenData = tokenResponse?.data || token

	const { data: utxoCountData, error: utxoCountError } = useSWR<UtxoCountResponse>(
		`${API_URL}/api/minters/${token.tokenId}/utxoCount`,
		fetcher,
		{
			refreshInterval: 10000, // Refetch every 10 seconds
			dedupingInterval: 5000 // Dedupe requests within 5 seconds
		}
	)

	const { address } = useWallet()

	// New SWR hook for wallet UTXO count
	const { data: walletUtxoCount, error: walletUtxoError } = useSWR(
		address ? ['walletUtxoCount', address] : null,
		async () => {
			if (!address) return null
			return await getBitcoinUtxoCount()
		}
	)

	const [showSplitForm, setShowSplitForm] = useState(false)

	// Define the form schema
	const formSchema = z.object({
		minBTC: z.number().min(0.01, 'Minimum 0.01 BTC required'),
		splitCount: z
			.number()
			.min(2, 'Minimum split count is 2')
			.max(100, 'Maximum split count is 100')
	})

	// Initialize the form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			minBTC: 0.01, // Updated default value
			splitCount: 10
		}
	})

	// Handle form submission
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		const minSats = btcToSats(values.minBTC)
		handleSplit(values.splitCount, minSats)
		setShowSplitForm(false)
	}

	useEffect(() => {
		if (tokenError || utxoCountError || walletUtxoError) {
			setError('Failed to load token details or wallet information. Please try again later.')
			console.error('Error fetching data:', tokenError || utxoCountError || walletUtxoError)
		} else {
			setError(null)
		}
	}, [tokenError, utxoCountError, walletUtxoError])

	useEffect(() => {
		const fee = process.env.NEXT_PUBLIC_FEE_SATS
		if (fee) {
			setServiceFee((parseInt(fee) / 1e8).toString())
		}
	}, [])

	if (error) {
		return <ErrorDisplay message={error} />
	}

	// const tokenData = tokenResponse.data
	const utxoCount = utxoCountData?.data?.count

	// Safely parse numeric values
	const maxSupply = safeParseInt(tokenData.info?.max)
	// const premine = safeParseInt(tokenData.info?.premine)
	// const limitPerMint = safeParseInt(tokenData.info?.limit)
	const mintCount = tokenData?.supply / Math.pow(10, tokenData.decimals)
	const currentSupply = mintCount // Remove premine from currentSupply
	const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'

	const isMintable = currentSupply < maxSupply && !!utxoCount && utxoCount > 0

	const isLoading = !utxoCountData

	return (
		<>
			<TokenHeader tokenData={tokenData} />
			<div className="container mx-auto p-4 space-y-6 h-full flex-grow flex flex-col items-center justify-center">
				<div className="flex flex-col justify-center items-center">
					{isLoading ? (
						<Card className="w-[400px] max-w-[100vw]">
							<CardContent className="p-6 space-y-4">
								<Skeleton className="h-8 w-3/4 mx-auto" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-10 w-full" />
							</CardContent>
						</Card>
					) : (
						<>
							<h2 className="text-2xl font-bold mb-4">{isMintable ? 'Mint Live!' : 'Mint Ended'}</h2>
							{!isMintable && <p className="text-muted-foreground">Check back later!</p>}
							{isMintable && (
								<Card className="w-[400px] max-w-[100vw]">
									<CardContent className="p-6 space-y-4">
										{isLoading ? (
											<CardSkeleton />
										) : (
											<>
												<div>
													<div className="flex justify-between">
														<p className="text-sm font-medium mb-1">Mint Progress: {mintProgress}%</p>
													</div>
													<Progress value={parseFloat(mintProgress)} className="w-full" />
												</div>
												<div>
													<p className="text-sm font-medium">Supply</p>
													<p className="text-sm font-medium mb-1 text-muted-foreground">
														{currentSupply.toLocaleString()}/{maxSupply.toLocaleString()}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium">Limit Per Mint</p>
													<p className="text-sm font-medium mb-1 text-muted-foreground">
														{tokenData.info?.limit}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium flex items-center gap-2">
														Mint UTXOS
														<HoverCard>
															<HoverCardTrigger>
																<InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
															</HoverCardTrigger>
															<HoverCardContent className="w-80">
																<div className="space-y-2">
																	<h4 className="text-sm font-semibold">Mint UTXOs</h4>
																	<p className="text-sm">
																		Mint UTXOs are special Bitcoin outputs used for minting new tokens.
																		Each UTXO can only be used once, ensuring accurate token supply
																		tracking.
																	</p>
																	<p className="text-sm">
																		More available Mint UTXOs allow for higher concurrent minting
																		capacity.
																	</p>
																</div>
															</HoverCardContent>
														</HoverCard>
													</p>
													<p className="text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2 h-4">
														{utxoCount}
														<div
															className={`w-2 h-2 rounded-full ${
																isMintable ? 'bg-green-500' : 'bg-red-500'
															} animate-pulse`}
														></div>
													</p>
												</div>

												{address && walletUtxoCount !== undefined && (
													<>
														<div>
															<p className="text-sm font-medium flex items-center gap-2">
																Wallet UTXOs
																<HoverCard>
																	<HoverCardTrigger>
																		<InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
																	</HoverCardTrigger>
																	<HoverCardContent className="w-80">
																		<div className="space-y-2">
																			<p className="text-sm">
																				Wallet UTXOs are unspent Bitcoin outputs in your wallet used for
																				paying minting fees.
																			</p>
																			<p className="text-sm">
																				Splitting UTXOs creates smaller amounts for better fee
																				management and concurrent minting.
																			</p>
																		</div>
																	</HoverCardContent>
																</HoverCard>
															</p>
															<div className="flex items-center justify-between">
																<p className="text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2 h-4">
																	{walletUtxoCount === undefined ? 'Loading...' : walletUtxoCount}
																	{walletUtxoCount !== undefined && (
																		<div
																			className={`w-2 h-2 rounded-full ${
																				!!walletUtxoCount && walletUtxoCount > 0
																					? 'bg-green-500'
																					: 'bg-red-500'
																			} animate-pulse`}
																		></div>
																	)}
																</p>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => setShowSplitForm(!showSplitForm)}
																	disabled={
																		isSplitting ||
																		walletUtxoCount === undefined ||
																		walletUtxoCount === 0
																	}
																>
																	Split UTXOs
																</Button>
															</div>
														</div>

														{showSplitForm && (
															<Form {...form}>
																<form
																	onSubmit={form.handleSubmit(onSubmit)}
																	className="space-y-4 border rounded p-4"
																>
																	<FormField
																		control={form.control}
																		name="minBTC"
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Minimum FB per UTXO</FormLabel>
																				<FormControl>
																					<Input
																						type="number"
																						step="0.01"
																						min="0.01"
																						{...field}
																						onChange={e => field.onChange(Number(e.target.value))}
																					/>
																				</FormControl>
																				<FormDescription>
																					Minimum 0.01 FB (1,000,000 sats)
																				</FormDescription>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>
																	<FormField
																		control={form.control}
																		name="splitCount"
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>Split Count: {field.value}</FormLabel>
																				<FormControl>
																					<Slider
																						min={2}
																						max={100}
																						step={1}
																						value={[field.value]}
																						onValueChange={value => field.onChange(value[0])}
																					/>
																				</FormControl>
																			</FormItem>
																		)}
																	/>
																	<div>
																		{serviceFee && (
																			<p className="text-sm text-muted-foreground mb-1">
																				Service fee: {serviceFee} FB
																			</p>
																		)}
																		<Button
																			type="submit"
																			disabled={isSplitting}
																			variant="outline"
																			className="w-full mt-0"
																		>
																			{isSplitting ? 'Splitting...' : 'Split'}
																		</Button>
																	</div>
																</form>
															</Form>
														)}
													</>
												)}

												<Button
													onClick={handleMint}
													disabled={isMinting || !isMintable || utxoCount === 0}
													className="w-full"
												>
													{isMinting
														? 'Minting...'
														: !isMintable
														? 'Mint Ended'
														: utxoCount === 0
														? 'No UTXOs Available'
														: 'Mint Now'}
												</Button>
											</>
										)}
									</CardContent>
								</Card>
							)}
						</>
					)}
				</div>
			</div>
		</>
	)
}

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
	<div className="container mx-auto p-4">
		<Card>
			<CardContent className="p-6">
				<p className="text-red-500">{message}</p>
				<Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
					Return to Token List
				</Link>
			</CardContent>
		</Card>
	</div>
)

// Helper function to safely parse integers
const safeParseInt = (value: string | undefined): number => {
	if (!value) return 0
	const parsed = parseInt(value, 10)
	return isNaN(parsed) ? 0 : parsed
}

// Add this new component for the card skeleton
const CardSkeleton: React.FC = () => (
	<>
		<Skeleton className="w-full h-4 mb-2" />
		<Skeleton className="w-full h-8 mb-4" />
		<div className="space-y-2">
			<Skeleton className="w-1/4 h-4" />
			<Skeleton className="w-3/4 h-4" />
		</div>
		<div className="space-y-2">
			<Skeleton className="w-1/4 h-4" />
			<Skeleton className="w-3/4 h-4" />
		</div>
		<div className="space-y-2">
			<Skeleton className="w-1/4 h-4" />
			<Skeleton className="w-3/4 h-4" />
		</div>
		<Skeleton className="w-full h-10" />
	</>
)

export default TokenDetail
