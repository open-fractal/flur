'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CopyableTokenId } from '@/components/CopyableTokenId'
import { formatNumber } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { API_URL } from '@/lib/constants'
import { Button } from '@/components/ui/button'
const fetcher = (url: string) => fetch(url).then(res => res.json())
import { useMint } from '@/hooks/use-mint'

interface TokenResponse {
	code: number
	msg: string
	data: TokenData
}

interface TokenData {
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

const TokenDetail: React.FC = () => {
	const params = useParams()
	const tokenId = params?.id as string

	const { isMinting, handleMint } = useMint(tokenId)

	const { data: tokenResponse, error: tokenError } = useSWR<TokenResponse>(
		`${API_URL}/api/tokens/${tokenId}?v=1`,
		fetcher
	)

	const { data: minterData, error: minterError } = useSWR<MinterResponse>(
		tokenResponse ? `${API_URL}/api/tokens/${tokenId}/supply?v=1` : null,
		fetcher
	)

	if (tokenError || minterError)
		return <div className="container mx-auto p-4">Failed to load token details</div>
	if (!tokenResponse || !minterData) return <TokenDetailSkeleton />

	const tokenData = tokenResponse.data

	const maxSupply = tokenData.info ? parseInt(tokenData.info.max) : 0
	const premine = tokenData.info ? parseInt(tokenData.info.premine) : 0
	const limitPerMint = tokenData.info ? parseInt(tokenData.info.limit) : 0
	const mintCount = parseInt(minterData.data.supply) / Math.pow(10, tokenData.decimals)
	const currentSupply = premine + mintCount
	const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Link href="/" className="flex items-center hover:underline">
				<ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Token List
			</Link>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl flex items-center justify-between">
						<span>
							{tokenData.name} ({tokenData.symbol})
						</span>
						<CopyableTokenId tokenId={tokenData.tokenId} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6 space-y-4">
					<div>
						<p className="text-sm font-medium mb-1">Mint Progress: {mintProgress}%</p>
						<Progress value={parseFloat(mintProgress)} className="w-full" />
					</div>
					<InfoItem
						label="Current Supply"
						value={`${formatNumber(currentSupply.toFixed(tokenData.decimals))} / ${formatNumber(
							maxSupply
						)}`}
					/>
					<InfoItem label="Limit Per Mint" value={formatNumber(limitPerMint)} />
					{premine > 0 && (
						<InfoItem
							label="Premine"
							value={`${formatNumber(premine)} (${((premine / maxSupply) * 100).toFixed(2)}%)`}
						/>
					)}
					<InfoItem label="Minter Address" value={tokenData.minterAddr} />
					<InfoItem label="Token Address" value={tokenData.tokenAddr} />
					<InfoItem label="Decimals" value={tokenData.decimals.toString()} />
					<InfoItem label="Genesis Transaction" value={tokenData.genesisTxid} />
					<InfoItem label="Reveal Transaction" value={tokenData.revealTxid} />
					<InfoItem label="Reveal Height" value={tokenData.revealHeight.toString()} />
					{/* Add Mint Button */}
					<Button onClick={handleMint} disabled={isMinting} className="w-full">
						{isMinting ? 'Minting...' : 'Mint'}
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
	<div>
		<p className="text-sm font-medium">{label}</p>
		<p className="mt-1 text-sm">{value}</p>
	</div>
)

const TokenDetailSkeleton: React.FC = () => (
	<div className="container mx-auto p-4 space-y-6">
		<Skeleton className="h-6 w-40" />
		<Card>
			<CardHeader>
				<Skeleton className="h-8 w-[200px]" />
			</CardHeader>
			<CardContent className="p-6 space-y-4">
				{[...Array(10)].map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-6 w-full" />
					</div>
				))}
			</CardContent>
		</Card>
	</div>
)

export default TokenDetail
