'use client'

import React from 'react'
import { TokenData } from '@/hooks/use-token'
import { formatNumber } from '@/lib/utils'
import { CopyableTokenId } from '@/components/CopyableTokenId'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TokenHeaderProps {
	tokenData: TokenData
}

// Helper function to render individual stat
const renderStat = (label: string, value: string | number, copyable?: boolean, unit?: string) => (
	<div className="flex flex-col items-start" key={label}>
		<span className="font-semibold">{label}</span>
		{copyable ? (
			<span className="text-muted-foreground text-sm">
				<CopyableTokenId tokenId={value.toString()} />
			</span>
		) : (
			<span className="text-muted-foreground text-sm">
				{typeof value === 'number' ? formatNumber(value) : value}
				{unit && ` ${unit}`}
			</span>
		)}
	</div>
)

export const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenData }) => {
	const pathname = usePathname()

	if (!tokenData) return null

	const premine = parseInt(tokenData.info?.premine || '0', 10)
	const decimals = tokenData.info?.decimals || 0
	const supply = tokenData.supply / Math.pow(10, decimals)

	const stats = [
		{ label: 'Token ID', value: tokenData.tokenId, copyable: true },
		{ label: 'Symbol', value: tokenData.symbol },
		{ label: 'Supply', value: supply },
		{ label: 'Market Cap', value: parseFloat(tokenData.marketCap) / 1e8, unit: 'FB' },
		{ label: 'Total Volume', value: parseFloat(tokenData.totalVolume) / 1e8, unit: 'FB' },
		{ label: 'Holders', value: tokenData.holders },
		{ label: 'Premine', value: premine }
	]

	const tabs = [
		{ value: 'mint', label: 'Mint', href: `/token/${tokenData.tokenId}/mint` },
		{ value: 'market', label: 'Market', href: `/token/${tokenData.tokenId}/market` },
		{ value: 'transfer', label: 'Transfer', href: `/token/${tokenData.tokenId}/transfer` }
	]

	const currentTab = tabs.find(tab => pathname?.includes(tab.value))?.value || 'market'

	console.log(currentTab)

	return (
		<div className="bg-black text-white border-b">
			<div className="px-8 pt-4">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 items-start">
					<div className="flex flex-col items-start gap-0">
						<h1 className="text-xl font-bold whitespace-nowrap">
							{tokenData.name}
							<span className="ml-2 text-sm text-gray-400 whitespace-nowrap">
								{tokenData.symbol}
							</span>
						</h1>
						<div className="mt-1">
							<nav className="h-8 flex space-x-4 justify-end">
								{tabs.map(tab => (
									<div key={tab.value} className="relative flex h-full justify-center items-center">
										<Link
											href={tab.href}
											className={cn(
												'px-1 py-1 text-sm font-medium',
												currentTab === tab.value ? 'text-white' : 'text-gray-400 hover:text-white'
											)}
										>
											{tab.label}
										</Link>
										{currentTab === tab.value && (
											<div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
										)}
									</div>
								))}
							</nav>
						</div>
					</div>
					<div className="flex gap-6 max-w-100vh overflow-x-auto">
						{stats.map(stat => renderStat(stat.label, stat.value, stat.copyable, stat.unit))}
					</div>
				</div>
			</div>
		</div>
	)
}
