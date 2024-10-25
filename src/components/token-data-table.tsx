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
import { useEffect, useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import InfiniteScroll from 'react-infinite-scroll-component'

// Define TokenData interface
export interface TokenData {
	name: string
	symbol: string
	tokenId: string
	holders: number
	supply: string
	decimals: number
	revealHeight: string
	mintUtxoCount: number
	marketCap: string // Changed to string
	totalVolume: string // Changed to string
	info: {
		max: string
		limit: string
		premine: string
		minterMd5: string
	}
}

const PAGE_SIZE = 64

const truncateTokenId = (tokenId: string) => {
	return `${tokenId.slice(0, 4)}...${tokenId.slice(-4)}`
}

const SortButton = ({ column, children }: { column: any; children: React.ReactNode }) => {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			className={`font-semibold text-xs tracking-wide w-full justify-start px-0 hover:bg-transparent ${
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
	const { handleMint, isMinting } = useMint(token.tokenId)

	if (token.mintUtxoCount <= 0) {
		return null
	}

	return (
		<div className="w-full text-center">
			<Button
				onClick={() => handleMint(0)}
				disabled={isMinting}
				size="sm"
				variant="outline"
				className="w-full px-2"
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
		size: 64, // This corresponds to w-16 in Tailwind (16 * 4px = 64px)
		minSize: 64,
		maxSize: 64
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <SortButton column={column}>NAME</SortButton>,
		cell: ({ row }) => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="truncate max-w-[150px]">{row.getValue('name')}</div>
					</TooltipTrigger>
					<TooltipContent>{row.getValue('name')}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
		size: 150,
		minSize: 150,
		maxSize: 150
	},
	{
		accessorKey: 'symbol',
		header: ({ column }) => <SortButton column={column}>SYMBOL</SortButton>,
		cell: ({ row }) => <div className="truncate max-w-[100px]">{row.getValue('symbol')}</div>,
		size: 100 // Set a fixed width for the symbol column
	},
	{
		accessorKey: 'holders',
		header: ({ column }) => <SortButton column={column}>HOLDERS</SortButton>,
		cell: ({ row }) => (
			<div className="whitespace-nowrap">{formatNumber(row.getValue('holders'))}</div>
		),
		size: 100 // Set a fixed width for the holders column
	},
	{
		accessorKey: 'marketCap',
		header: ({ column }) => <SortButton column={column}>MARKET CAP</SortButton>,
		cell: ({ row }) => {
			const marketCapSats = row.original.marketCap
			const marketCapFB = marketCapSats ? parseFloat(marketCapSats) / 1e8 : 0
			return (
				<div className="whitespace-nowrap">
					{marketCapSats ? `${formatNumber(marketCapFB.toFixed(2))} FB` : '-'}
				</div>
			)
		},
		sortingFn: (rowA, rowB) => {
			const capA = parseFloat(rowA.original.marketCap) / 1e8 || 0
			const capB = parseFloat(rowB.original.marketCap) / 1e8 || 0
			return capA - capB
		},
		size: 120
	},
	{
		accessorKey: 'totalVolume',
		header: ({ column }) => <SortButton column={column}>VOLUME</SortButton>,
		cell: ({ row }) => {
			const volumeSats = row.original.totalVolume
			const volumeFB = volumeSats ? parseFloat(volumeSats) / 1e8 : 0
			return (
				<div className="whitespace-nowrap">
					{volumeSats ? `${formatNumber(volumeFB.toFixed(2))} FB` : '-'}
				</div>
			)
		},
		sortingFn: (rowA, rowB) => {
			const volA = parseFloat(rowA.original.totalVolume) / 1e8 || 0
			const volB = parseFloat(rowB.original.totalVolume) / 1e8 || 0
			return volA - volB
		},
		size: 120
	},
	{
		accessorKey: 'tokenId',
		header: ({ column }) => <SortButton column={column}>TOKEN ID</SortButton>,
		cell: ({ row }) => (
			<div className="whitespace-nowrap">{truncateTokenId(row.getValue('tokenId'))}</div>
		),
		size: 120 // Set a fixed width for the tokenId column
	},
	{
		accessorKey: 'currentSupply',
		header: ({ column }) => <SortButton column={column}>SUPPLY</SortButton>,
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
		},
		size: 120 // Set a fixed width for the currentSupply column
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
		},
		size: 120 // Set a fixed width for the maxSupply column
	},
	{
		accessorKey: 'progress',
		header: ({ column }) => <SortButton column={column}>PROGRESS</SortButton>,
		cell: ({ row }) => {
			const token = row.original
			const maxSupply = parseInt(token.info.max)
			const currentSupply = parseInt(token.supply) / Math.pow(10, token.decimals)
			const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'
			return (
				<div className="flex items-center space-x-2">
					<Progress value={parseFloat(mintProgress)} className="w-20" />
					<span className="text-xs text-muted-foreground">{mintProgress}%</span>
				</div>
			)
		},
		sortingFn: (rowA, rowB) => {
			const progressA =
				(parseInt(rowA.original.supply) /
					Math.pow(10, rowA.original.decimals) /
					parseInt(rowA.original.info.max)) *
				100
			const progressB =
				(parseInt(rowB.original.supply) /
					Math.pow(10, rowB.original.decimals) /
					parseInt(rowB.original.info.max)) *
				100
			return progressA - progressB
		},
		size: 180 // Set a fixed width for the progress column
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
		},
		size: 120 // Set a fixed width for the premine column
	},
	{
		accessorKey: 'revealHeight',
		header: ({ column }) => <SortButton column={column}>CREATED</SortButton>,
		cell: ({ row }) => {
			const revealHeight = parseInt(row.original.revealHeight)
			return <div className="whitespace-nowrap">{revealHeight.toLocaleString()}</div>
		},
		sortingFn: (rowA, rowB) => {
			return parseInt(rowA.original.revealHeight) - parseInt(rowB.original.revealHeight)
		},
		size: 120 // Set a fixed width for the revealHeight column
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
	// const total = tokenResponse?.data?.total || 0

	// Load initial state from localStorage
	const initialState = useMemo(() => {
		if (typeof window !== 'undefined') {
			const savedState = localStorage.getItem('tokenTableState')
			if (savedState) {
				return JSON.parse(savedState)
			}
		}
		return {
			sorting: [{ id: 'holders', desc: true }],
			columnFilters: [],
			columnVisibility: {},
			currentPage: 1,
			globalFilter: '',
			filterValue: 'mintable'
		}
	}, [])

	const [sorting, setSorting] = React.useState<SortingState>(initialState.sorting)
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		initialState.columnFilters
	)
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
		initialState.columnVisibility
	)
	const [currentPage, setCurrentPage] = React.useState(initialState.currentPage)
	const [globalFilter, setGlobalFilter] = React.useState(initialState.globalFilter)
	const [filterValue, setFilterValue] = React.useState(initialState.filterValue)

	const debouncedGlobalFilter = useDebounce(globalFilter, 300)
	const router = useRouter()

	const filteredTokens = React.useMemo(() => {
		if (!tokens) return []
		if (filterValue === 'all') return tokens
		return tokens.filter(token => {
			return token.mintUtxoCount > 0
		})
	}, [tokens, filterValue])

	// Calculate total pages based on filtered tokens
	const totalFilteredPages = Math.ceil(filteredTokens.length / PAGE_SIZE)

	const table = useReactTable({
		data: filteredTokens,
		columns,
		onSortingChange: updater => {
			setSorting(updater)
			setCurrentPage(1) // Reset to first page when sorting changes
		},
		onColumnFiltersChange: updater => {
			setColumnFilters(updater)
			setCurrentPage(1) // Reset to first page when filters change
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
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
		pageCount: totalFilteredPages // Use the calculated total pages
	})

	// Save state to localStorage whenever it changes
	useEffect(() => {
		const stateToSave = {
			sorting,
			columnFilters,
			columnVisibility,
			currentPage,
			globalFilter,
			filterValue
		}
		localStorage.setItem('tokenTableState', JSON.stringify(stateToSave))
	}, [sorting, columnFilters, columnVisibility, currentPage, globalFilter, filterValue])

	// Add this effect after the table initialization
	React.useEffect(() => {
		if (currentPage > totalFilteredPages) {
			setCurrentPage(1)
		}
	}, [filterValue, totalFilteredPages])

	// State to manage the number of items to display
	const [itemsToShow, setItemsToShow] = React.useState(PAGE_SIZE)

	// Function to load more items
	const loadMoreItems = () => {
		setItemsToShow(prev => prev + PAGE_SIZE)
	}

	if (!tokenResponse || !tokens) {
		return <TableSkeleton />
	}

	if (tokens.length === 0) {
		return null
	}

	return (
		<div className="w-full">
			<div className="px-4 flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0 md:space-x-4">
				<div className="flex items-center space-x-4 w-full">
					<Select value={filterValue} onValueChange={setFilterValue}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter tokens" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="mintable">Mintable</SelectItem>
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
			<InfiniteScroll
				dataLength={itemsToShow}
				next={loadMoreItems}
				hasMore={itemsToShow < filteredTokens.length}
				loader={<React.Fragment />}
				className="max-h-[calc(100vh-150px)] h-[calc(100vh-150px)] overflow-y-auto flex flex-col"
				scrollableTarget="scrollableDiv"
			>
				<Table className="w-full min-w-full" containerId="scrollableDiv">
					<TableHeader className="sticky top-0 bg-black z-10">
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead
										key={header.id}
										className="text-left whitespace-nowrap overflow-hidden"
										style={{ width: `${header.getSize()}px` }}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table
							.getRowModel()
							.rows.slice(0, itemsToShow)
							.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									onClick={() => router.push(`/token/${row.original.tokenId}`)}
									className="cursor-pointer duration-200 h-12"
								>
									{row.getVisibleCells().map(cell => (
										<TableCell
											key={cell.id}
											className="whitespace-nowrap overflow-hidden text-ellipsis"
											style={{ width: `${cell.column.getSize()}px` }}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</InfiniteScroll>
		</div>
	)
}