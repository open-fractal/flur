'use client'

import React, { useState, useMemo, Suspense } from 'react'
import { TokenData } from '@/hooks/use-token'
import { formatNumber } from '@/lib/utils'
import { CopyableTokenId } from '@/components/CopyableTokenId'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useWallet } from '@/lib/unisat'
import { useBalance } from '@/hooks/use-balance'
import dynamic from 'next/dynamic'

// Dynamically import the TransferToken component with SSR disabled
const TransferToken = dynamic(
	() => import('@/app/token/[id]/transfer-token').then(mod => mod.TransferToken),
	{ ssr: false }
)

interface TokenHeaderProps {
	tokenData: TokenData
}

// Helper function to render individual stat
const renderStat = (label: string, value: string | number, copyable?: boolean) => (
	<div className="flex flex-col items-start" key={label}>
		<span className="font-semibold">{label}</span>
		{copyable ? (
			<span className="text-muted-foreground text-sm">
				<CopyableTokenId tokenId={value.toString()} />
			</span>
		) : (
			<span className="text-muted-foreground text-sm">
				{typeof value === 'number' ? formatNumber(value) : value}
			</span>
		)}
	</div>
)

export const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenData }) => {
	const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
	const { isWalletConnected } = useWallet()
	const { tokenBalance, isLoading } = useBalance(tokenData)

	const canTransfer = useMemo(() => {
		return isWalletConnected && !isLoading && parseFloat(tokenBalance) > 0
	}, [isWalletConnected, isLoading, tokenBalance])

	if (!tokenData) return null

	const premine = parseInt(tokenData.info?.premine || '0', 10)

	const stats = [
		{ label: 'Token ID', value: tokenData.tokenId, copyable: true },
		{ label: 'Symbol', value: tokenData.symbol },
		{ label: 'Supply', value: tokenData.supply / Math.pow(10, tokenData.info?.decimals || 0) },
		{ label: 'Holders', value: tokenData.holders },
		{ label: 'Premine', value: premine }
	]

	return (
		<div className="bg-black text-white border-b">
			<div className="px-8 py-4 ">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
					<div className="flex justify-start items-star gap-4">
						<h1 className="text-xl font-bold whitespace-nowrap">
							{tokenData.name}
							<span className="ml-2 text-sm text-gray-400 whitespace-nowrap">
								{tokenData.symbol}
							</span>
						</h1>
						{canTransfer && (
							<Suspense fallback={<Button variant="outline">Loading...</Button>}>
								<Dialog open={isBalanceModalOpen} onOpenChange={setIsBalanceModalOpen}>
									<DialogTrigger asChild>
										<Button variant="outline">Transfer Tokens</Button>
									</DialogTrigger>
									<DialogContent className="p-0 w-[400px]">
										<TransferToken token={tokenData} />
									</DialogContent>
								</Dialog>
							</Suspense>
						)}
					</div>
					<div className="flex gap-6 max-w-100vh overflow-x-auto">
						{stats.map(stat => renderStat(stat.label, stat.value, stat.copyable))}
					</div>
				</div>
			</div>
		</div>
	)
}
