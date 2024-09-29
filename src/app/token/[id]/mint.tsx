'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useMint } from '@/hooks/use-mint'
import { TokenData } from '@/hooks/use-token'

interface MintProps {
	token: TokenData
	utxoCount: number | undefined
	isUtxoCountLoading: boolean
}

const Mint: React.FC<MintProps> = ({ token, utxoCount, isUtxoCountLoading }) => {
	const { isMinting, handleMint } = useMint(token.tokenId)

	// Safely parse numeric values
	const maxSupply = safeParseInt(token.info?.max)
	const mintCount = token?.supply / Math.pow(10, token.decimals)
	const currentSupply = mintCount
	const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'
	const isMintable = currentSupply < maxSupply && !!utxoCount && utxoCount > 0

	return (
		<Card className="w-[400px] max-w-[100vw]">
			<CardContent className="p-6 space-y-4">
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
					<p className="text-sm font-medium mb-1 text-muted-foreground">{token.info?.limit}</p>
				</div>
				<div>
					<p className="text-sm font-medium">Mint UTXOs</p>
					<p className="text-sm font-medium mb-1 text-muted-foreground">
						{isUtxoCountLoading ? 'Loading...' : utxoCount}
					</p>
				</div>
				<Button
					onClick={() => handleMint(utxoCount)}
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
			</CardContent>
		</Card>
	)
}

// Helper function to safely parse integers
const safeParseInt = (value: string | undefined): number => {
	if (!value) return 0
	const parsed = parseInt(value, 10)
	return isNaN(parsed) ? 0 : parsed
}

export default Mint
