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
}

interface MinterData {
	supply: string
}

interface MinterResponse {
	code: number
	msg: string
	data: MinterData
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

	const { isMinting, handleMint } = useMint(token.tokenId)

	const { data: tokenResponse, error: tokenError } = useSWR<TokenResponse>(
		`${API_URL}/api/tokens/${token.tokenId}?v=1`,
		fetcher
	)

	const tokenData = tokenResponse?.data || token

	const { data: minterData, error: minterError } = useSWR<MinterResponse>(
		`${API_URL}/api/tokens/${token.tokenId}/supply?v=1`,
		fetcher
	)

	const { data: utxoCountData, error: utxoCountError } = useSWR<UtxoCountResponse>(
		`${API_URL}/api/minters/${token.tokenId}/utxoCount`,
		fetcher,
		{
			refreshInterval: 10000, // Refetch every 10 seconds
			dedupingInterval: 5000 // Dedupe requests within 5 seconds
		}
	)

	useEffect(() => {
		if (tokenError || minterError || utxoCountError) {
			setError('Failed to load token details. Please try again later.')
			console.error('Error fetching data:', tokenError || minterError || utxoCountError)
		} else {
			setError(null)
		}
	}, [tokenError, minterError, utxoCountError])

	if (error) {
		return <ErrorDisplay message={error} />
	}

	// if (!tokenResponse || !minterData || !utxoCountData) return <TokenDetailSkeleton />

	// const tokenData = tokenResponse.data
	const utxoCount = utxoCountData?.data?.count

	// Safely parse numeric values
	const maxSupply = safeParseInt(tokenData.info?.max)
	const premine = safeParseInt(tokenData.info?.premine)
	// const limitPerMint = safeParseInt(tokenData.info?.limit)
	const mintCount = safeParseInt(minterData?.data?.supply) / Math.pow(10, tokenData.decimals)
	const currentSupply = premine + mintCount
	const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'

	const isMintable = currentSupply < maxSupply

	const isLoading = !minterData || !utxoCountData

	return (
		<>
			<TokenHeader tokenData={tokenData} currentSupply={currentSupply} />
			<div className="container mx-auto p-4 space-y-6 h-full flex-grow flex flex-col items-center justify-center">
				<div className="flex flex-col justify-center items-center">
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
