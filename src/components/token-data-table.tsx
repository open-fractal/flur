'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react'
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { formatNumber } from '@/lib/utils'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination'
import { useDebounce } from '@/hooks/use-debounce'
import useSWR from 'swr'
import { API_URL } from '@/lib/constants'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useMint } from '@/hooks/use-mint'
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// Define TokenData interface
export interface TokenData {
	name: string
	symbol: string
	tokenId: string
	holders: number
	supply: string
	decimals: number
	info: {
		max: string
		limit: string
		premine: string
		minterMd5: string
	}
}

const PAGE_SIZE = 16

const truncateTokenId = (tokenId: string) => {
	return `${tokenId.slice(0, 4)}...${tokenId.slice(-4)}`
}

const SortButton = ({ column, children }: { column: any; children: React.ReactNode }) => {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			className={`font-semibold text-xs tracking-wide w-full justify-start px-0 ${
				column.getIsSorted() ? 'text-white font-bold' : ''
			}`}
		>
			{children}
			{column.getIsSorted() === 'asc' && <ChevronUp className="ml-2 h-4 w-4" />}
			{column.getIsSorted() === 'desc' && <ChevronDown className="ml-2 h-4 w-4" />}
			{!column.getIsSorted() && <ChevronsUpDown className="ml-2 h-4 w-4" />}
		</Button>
	)
}

// New component for the action cell
const ActionCell = React.memo(({ token }: { token: TokenData }) => {
	const currentSupply = parseInt(token.supply) / Math.pow(10, token.decimals)
	const maxSupply = parseInt(token.info.max)
	const isMintingComplete = currentSupply >= maxSupply

	const { handleMint, isMinting } = useMint(token.tokenId)

	if (isMintingComplete) {
		return null
	}

	return (
		<div className="text-right">
			<Button
				onClick={handleMint}
				disabled={isMintingComplete || isMinting}
				size="sm"
				variant="outline"
				className="w-16"
			>
				{isMinting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mint'}
			</Button>
		</div>
	)
})

ActionCell.displayName = 'ActionCell'

export const columns: ColumnDef<TokenData>[] = [
	{
		id: 'actions',
		cell: ({ row }) => <ActionCell token={row.original} />,
		header: () => <div className="text-left"></div>,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <SortButton column={column}>NAME</SortButton>,
		cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'symbol',
		header: ({ column }) => <SortButton column={column}>SYMBOL</SortButton>,
		cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue('symbol')}</div>,
	},
	{
		accessorKey: 'holders',
		header: ({ column }) => <SortButton column={column}>HOLDERS</SortButton>,
		cell: ({ row }) => (
			<div className="whitespace-nowrap">{formatNumber(row.getValue('holders'))}</div>
		),
	},
	{
		accessorKey: 'tokenId',
		header: ({ column }) => <SortButton column={column}>TOKEN ID</SortButton>,
		cell: ({ row }) => (
			<div className="whitespace-nowrap">{truncateTokenId(row.getValue('tokenId'))}</div>
		),
	},
	{
		accessorKey: 'currentSupply',
		header: ({ column }) => <SortButton column={column}>CURRENT SUPPLY</SortButton>,
		cell: ({ row }) => {
			const token = row.original
			const currentSupply = parseInt(token.supply) / Math.pow(10, token.decimals)
			return (
				<div className="whitespace-nowrap">
					{formatNumber(currentSupply.toFixed(token.decimals))}
				</div>
			)
		},
		sortingFn: (rowA, rowB) => {
			const supplyA = parseInt(rowA.original.supply) / Math.pow(10, rowA.original.decimals)
			const supplyB = parseInt(rowB.original.supply) / Math.pow(10, rowB.original.decimals)
			return supplyA - supplyB
		}
	},
	{
		accessorKey: 'maxSupply',
		header: ({ column }) => <SortButton column={column}>MAX SUPPLY</SortButton>,
		cell: ({ row }) => {
			const maxSupply = parseInt(row.original.info.max)
			return <div className="whitespace-nowrap">{formatNumber(maxSupply)}</div>
		},
		sortingFn: (rowA, rowB) => {
			return parseInt(rowA.original.info.max) - parseInt(rowB.original.info.max)
		}
	},
	{
		accessorKey: 'progress',
		header: ({ column }) => <SortButton column={column}>MINTING PROGRESS</SortButton>,
		cell: ({ row }) => {
			const token = row.original
			const maxSupply = parseInt(token.info.max)
			const currentSupply = parseInt(token.supply) / Math.pow(10, token.decimals)
			const premine = parseInt(token.info.premine)
			const mintProgress =
				maxSupply > 0 ? (((currentSupply + premine) / maxSupply) * 100).toFixed(2) : '0.00'
			return (
				<div className="flex items-center space-x-2">
					<Progress value={parseFloat(mintProgress)} className="w-20" />
					<span className="text-xs text-muted-foreground">{mintProgress}%</span>
				</div>
			)
		},
		sortingFn: (rowA, rowB) => {
			const progressA =
				((parseInt(rowA.original.supply) / Math.pow(10, rowA.original.decimals) +
					parseInt(rowA.original.info.premine)) /
					parseInt(rowA.original.info.max)) *
				100
			const progressB =
				((parseInt(rowB.original.supply) / Math.pow(10, rowB.original.decimals) +
					parseInt(rowB.original.info.premine)) /
					parseInt(rowB.original.info.max)) *
				100
			return progressA - progressB
		}
	},
	{
		accessorKey: 'limitPerMint',
		header: ({ column }) => <SortButton column={column}>LIMIT PER MINT</SortButton>,
		cell: ({ row }) => {
			const limitPerMint = parseInt(row.original.info.limit)
			return <div className="whitespace-nowrap">{formatNumber(limitPerMint)}</div>
		},
		sortingFn: (rowA, rowB) => {
			return parseInt(rowA.original.info.limit) - parseInt(rowB.original.info.limit)
		}
	},
	{
		accessorKey: 'premine',
		header: ({ column }) => <SortButton column={column}>PREMINE</SortButton>,
		cell: ({ row }) => {
			const token = row.original
			const premine = parseInt(token.info.premine)
			const maxSupply = parseInt(token.info.max)
			return premine > 0 ? (
				<div className="text-xs text-muted-foreground">
					{formatNumber(premine)} ({((premine / maxSupply) * 100).toFixed(2)}%)
				</div>
			) : null
		},
		sortingFn: (rowA, rowB) => {
			return parseInt(rowA.original.info.premine) - parseInt(rowB.original.info.premine)
		}
	}
]

interface PaginatedTokenListResponse {
	code: number
	msg: string
	data: {
		tokens: TokenData[]
		total: number
	}
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const TableSkeleton = () => (
	<div className="w-full">
		<div className="flex items-center justify-between py-4">
			<Skeleton className="h-9 w-[200px]" />
			<Skeleton className="h-9 w-[180px]" />
		</div>
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{Array(9)
							.fill(0)
							.map((_, i) => (
								<TableHead key={i}>
									<Skeleton className="h-4 w-full" />
								</TableHead>
							))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array(PAGE_SIZE)
						.fill(0)
						.map((_, i) => (
							<TableRow key={i}>
								{Array(9)
									.fill(0)
									.map((_, j) => (
										<TableCell key={j}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
		<div className="flex items-center justify-between space-x-2 py-4">
			<Skeleton className="h-9 w-[300px]" />
		</div>
	</div>
)

export function TokenDataTable({}) {
	// Fetch token data using SWR
	const { data: tokenResponse } = useSWR<PaginatedTokenListResponse>(
		`${API_URL}/api/tokens?limit=10000&offset=0&v=1`,
		fetcher
	)

	// Ensure tokenResponse and tokenResponse.data are defined
	const tokens = tokenResponse?.data?.tokens || []
	const total = tokenResponse?.data?.total || 0

	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'holders', desc: true }])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [currentPage, setCurrentPage] = React.useState(1)
	const router = useRouter()
	const [globalFilter, setGlobalFilter] = React.useState('')
	const debouncedGlobalFilter = useDebounce(globalFilter, 300)
	const [filterValue, setFilterValue] = React.useState('minting')

	const filteredTokens = React.useMemo(() => {
		if (!tokens) return []
		if (filterValue === 'all') return tokens
		return tokens.filter(token => {
			const currentSupply = parseInt(token.supply) / Math.pow(10, token.decimals)
			const maxSupply = parseInt(token.info.max)
			return currentSupply < maxSupply
		})
	}, [tokens, filterValue])

	const table = useReactTable({
		data: filteredTokens || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		globalFilterFn: (row, columnId, filterValue) => {
			const value = row.getValue(columnId)
			if (typeof value === 'string') {
				return value.toLowerCase().includes(filterValue.toLowerCase())
			} else if (typeof value === 'number') {
				return value.toString().includes(filterValue)
			}
			// Add more type checks if needed
			return false
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize: PAGE_SIZE
			},
			globalFilter: debouncedGlobalFilter
		},
		initialState: {
			sorting: [{ id: 'holders', desc: true }]
		},
		manualPagination: true,
		pageCount: Math.ceil(total / PAGE_SIZE)
	})

	if (!tokenResponse || !tokens) {
		return <TableSkeleton />
	}

	if (tokens.length === 0) {
		return null
	}

	const totalPages = Math.ceil(total / table.getState().pagination.pageSize)

	const renderPageNumbers = () => {
		const pageNumbers = []
		const maxVisiblePages = 5

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(
					<PaginationItem key={i}>
						<PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
							{i}
						</PaginationLink>
					</PaginationItem>
				)
			}
		} else {
			const startPage = Math.max(1, currentPage - 2)
			const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

			if (startPage > 1) {
				pageNumbers.push(
					<PaginationItem key={1}>
						<PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
					</PaginationItem>
				)
				if (startPage > 2) {
					pageNumbers.push(<PaginationEllipsis key="ellipsis1" />)
				}
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(
					<PaginationItem key={i}>
						<PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
							{i}
						</PaginationLink>
					</PaginationItem>
				)
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					pageNumbers.push(<PaginationEllipsis key="ellipsis2" />)
				}
				pageNumbers.push(
					<PaginationItem key={totalPages}>
						<PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
					</PaginationItem>
				)
			}
		}

		return pageNumbers
	}

	return (
		<div className="w-full">
			<div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0 md:space-x-4">
				<div className="flex items-center space-x-4 w-full">
					<Select value={filterValue} onValueChange={setFilterValue}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter tokens" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="minting">Minting Now</SelectItem>
							<SelectItem value="all">Show All</SelectItem>
						</SelectContent>
					</Select>
					<div className="relative flex-1">
						<Input
							placeholder="Search"
							value={globalFilter}
							onChange={event => setGlobalFilter(event.target.value)}
							className="pl-10 w-full"
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					</div>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id} className="text-left">
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table
								.getRowModel()
								.rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
								.map(row => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
										onClick={() => router.push(`/token/${row.original.tokenId}`)}
										className="cursor-pointer duration-200"
									>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between space-x-2 py-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
								aria-disabled={currentPage === 1}
								tabIndex={currentPage === 1 ? -1 : undefined}
								className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
						{renderPageNumbers()}
						<PaginationItem>
							<PaginationNext
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
								aria-disabled={currentPage === totalPages}
								tabIndex={currentPage === totalPages ? -1 : undefined}
								className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	)
}
