'use client'

import { TokenData } from '@/app/token/[id]/page.client'
import { formatNumber } from '@/lib/utils'
import { CopyableTokenId } from '@/components/CopyableTokenId'

interface TokenHeaderProps {
	tokenData: TokenData
	currentSupply: number
}

// Helper function to render individual stat
const renderStat = (label: string, value: string | number) => (
	<div className="flex flex-col items-start">
		<span className="font-semibold">{label}</span>
		<span className="text-muted-foreground text-sm">
			{typeof value === 'number' ? formatNumber(value) : value}
		</span>
	</div>
)

export const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenData, currentSupply }) => {
	if (!tokenData) return null

	const maxSupply = parseInt(tokenData.info?.max || '0', 10)
	const limitPerMint = parseInt(tokenData.info?.limit || '0', 10)
	const premine = parseInt(tokenData.info?.premine || '0', 10)

	const stats = [
		{ label: 'Symbol', value: tokenData.symbol },
		{ label: 'Decimals', value: tokenData.decimals },
		{ label: 'Max Supply', value: maxSupply },
		{ label: 'Current Supply', value: currentSupply },
		{ label: 'Limit Per Mint', value: limitPerMint },
		{ label: 'Premine', value: premine }
	]

	return (
		<div className="bg-black text-white border-b">
			<div className="p-4">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-xl font-bold">
							{tokenData.name}
							<span className="ml-2 text-sm text-gray-400">{tokenData.symbol}</span>
						</h1>
						<h2 className="text-sm text-gray-400">
							<CopyableTokenId tokenId={tokenData.tokenId} />
						</h2>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
						{stats.map(stat => renderStat(stat.label, stat.value))}
					</div>
				</div>
			</div>
		</div>
	)
}
