import React from 'react'
import { useRouter } from 'next/navigation'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination'
import { formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useMint } from '@/hooks/use-mint'

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
	supply: string // New field
	holders: number // New field
}

interface TokenListProps {
	tokens: TokenData[]
	total: number
	currentPage: number
	onPageChange: (page: number) => void
}

const truncateTokenId = (tokenId: string) => {
	return `${tokenId.slice(0, 4)}...${tokenId.slice(-4)}`
}

const TokenInfo: React.FC<{ data: TokenData }> = ({ data }) => {
	const router = useRouter()

	const maxSupply = parseInt(data.info.max)
	const premine = parseInt(data.info.premine)
	const limitPerMint = parseInt(data.info.limit)
	const currentSupply = parseInt(data.supply) / Math.pow(10, data.decimals)
	const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'

	const isStillMinting = currentSupply < maxSupply

	const { isMinting, handleMint } = useMint(data.tokenId)

	const handleRowClick = () => {
		router.push(`/token/${data.tokenId}`)
	}

	return (
		<TableRow onClick={handleRowClick} className="cursor-pointer duration-200">
			<TableCell className="whitespace-nowrap">{data.symbol}</TableCell>
			<TableCell className="whitespace-nowrap">{truncateTokenId(data.tokenId)}</TableCell>
			<TableCell className="whitespace-nowrap">{formatNumber(data.holders)}</TableCell>
			<TableCell className="whitespace-nowrap">
				{formatNumber(currentSupply.toFixed(data.decimals))}
			</TableCell>
			<TableCell className="whitespace-nowrap">{formatNumber(maxSupply)}</TableCell>
			<TableCell className="whitespace-nowrap">
				<div className="flex items-center space-x-2">
					<Progress value={parseFloat(mintProgress)} className="w-20" />
					<span className="text-xs text-muted-foreground">{mintProgress}%</span>
				</div>
			</TableCell>
			<TableCell className="whitespace-nowrap">{formatNumber(limitPerMint)}</TableCell>
			<TableCell className="whitespace-nowrap">
				{premine > 0 && (
					<div className="text-xs text-muted-foreground">
						{formatNumber(premine)} ({((premine / maxSupply) * 100).toFixed(2)}%)
					</div>
				)}
			</TableCell>
			<TableCell>
				{data.info.minterMd5 === '21cbd2e538f2b6cc40ee180e174f1e25' && (
					<Button onClick={handleMint} disabled={!isStillMinting || isMinting} size="sm">
						{isMinting ? 'Minting...' : 'Mint'}
					</Button>
				)}
			</TableCell>
		</TableRow>
	)
}

export const TokenList: React.FC<TokenListProps> = ({
	tokens,
	total,
	currentPage,
	onPageChange
}) => {
	const ITEMS_PER_PAGE = 24
	const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

	const renderPageNumbers = () => {
		const pageNumbers = []
		const showEllipsisStart = currentPage > 3
		const showEllipsisEnd = currentPage < totalPages - 2

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i)
			}
		} else {
			pageNumbers.push(1)
			if (showEllipsisStart) pageNumbers.push('ellipsis')
			for (
				let i = Math.max(2, currentPage - 1);
				i <= Math.min(totalPages - 1, currentPage + 1);
				i++
			) {
				pageNumbers.push(i)
			}
			if (showEllipsisEnd) pageNumbers.push('ellipsis')
			pageNumbers.push(totalPages)
		}

		return pageNumbers
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto">
				<Table className="min-w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="whitespace-nowrap">Symbol</TableHead>
							<TableHead className="whitespace-nowrap">Token ID</TableHead>
							<TableHead className="whitespace-nowrap">Holders</TableHead>
							<TableHead className="whitespace-nowrap">Current Supply</TableHead>
							<TableHead className="whitespace-nowrap">Max Supply</TableHead>
							<TableHead className="whitespace-nowrap">Progress</TableHead>
							<TableHead className="whitespace-nowrap">Limit Per Mint</TableHead>
							<TableHead className="whitespace-nowrap">Premine</TableHead>
							<TableHead className="whitespace-nowrap">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tokens.map(token => (
							<TokenInfo key={token.tokenId} data={token} />
						))}
					</TableBody>
				</Table>
			</div>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={e => {
								e.preventDefault()
								if (currentPage > 1) onPageChange(currentPage - 1)
							}}
						/>
					</PaginationItem>
					{renderPageNumbers().map((page, index) => (
						<PaginationItem key={index}>
							{page === 'ellipsis' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									href="#"
									isActive={currentPage === page}
									onClick={e => {
										e.preventDefault()
										onPageChange(page as number)
									}}
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={e => {
								e.preventDefault()
								if (currentPage < totalPages) onPageChange(currentPage + 1)
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
