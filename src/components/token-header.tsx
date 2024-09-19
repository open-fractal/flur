'use client'

import { TokenData } from '@/app/token/[id]/page.client'
import { formatNumber } from '@/lib/utils'
import { CopyableTokenId } from '@/components/CopyableTokenId'

interface TokenHeaderProps {
	tokenData: TokenData
	currentSupply: number
}

// Helper function to render individual stat
const renderStat = (label: string, value: string | number, copyable?: boolean) => (
	<div className="flex flex-col items-start">
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

export const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenData, currentSupply }) => {
	if (!tokenData) return null

	const premine = parseInt(tokenData.info?.premine || '0', 10)

	const stats = [
		{ label: 'Token ID', value: tokenData.tokenId, copyable: true },
		{ label: 'Symbol', value: tokenData.symbol },
		{ label: 'Supply', value: currentSupply },
		{ label: 'Holders', value: '--' },
		{ label: 'Premine', value: premine }
	]

	return (
		<div className="bg-black text-white border-b">
			<div className="p-4">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-xl font-bold whitespace-nowrap">
							{tokenData.name}
							<span className="ml-2 text-sm text-gray-400 whitespace-nowrap">
								{tokenData.symbol}
							</span>
						</h1>
					</div>
					<div className="flex gap-6 max-w-100vh overflow-x-auto">
						{stats.map(stat => renderStat(stat.label, stat.value, stat.copyable))}
					</div>
				</div>
			</div>
		</div>
	)
}
