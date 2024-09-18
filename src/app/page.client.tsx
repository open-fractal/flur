'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { useWallet } from '@/lib/unisat'
import { TokenBalances } from '@/components/token-balances'
import { TokenList } from '@/components/TokenList'
import { CompactIndexerDashboard } from '@/components/indexer-status' // Import the new component
import { MintFee } from '@/components/mint-fee' // Import the new component
import { API_URL } from '@/lib/constants'
import { UnisatAPI } from '@/lib/unisat'
import { TokenData } from '@/components/TokenList'

const INDEXER_API_ENDPOINT = `${API_URL}/api?v=1`
const TOKEN_API_ENDPOINT = `${API_URL}/api/tokens?v=1`

interface IndexerDiagnostics {
	trackerBlockHeight: number
	nodeBlockHeight: number
	latestBlockHeight: number
}

interface ApiResponse {
	code: number
	msg: string
	data: IndexerDiagnostics
}

interface PaginatedTokenListResponse {
	code: number
	msg: string
	data: {
		tokens: TokenData[]
		total: number
	}
}

declare global {
	interface Window {
		unisat: UnisatAPI
	}
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
	const [currentPage, setCurrentPage] = useState(1)
	const { address } = useWallet()
	const ITEMS_PER_PAGE = 24

	const { data: indexerResponse, error: indexerError, isLoading: indexerLoading } = useSWR<
		ApiResponse
	>(INDEXER_API_ENDPOINT, fetcher, { refreshInterval: 5000 })

	const { data: tokenResponse, error: tokenError, isLoading: tokenLoading } = useSWR<
		PaginatedTokenListResponse
	>(
		`${TOKEN_API_ENDPOINT}&limit=${ITEMS_PER_PAGE}&offset=${(currentPage - 1) *
			ITEMS_PER_PAGE}&v=1`,
		fetcher
	)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const percentIndexed =
		indexerResponse && indexerResponse.data
			? (
					(indexerResponse.data.trackerBlockHeight / indexerResponse.data.latestBlockHeight) *
					100
			  ).toFixed(2)
			: null

	return (
		<div className="container mx-auto p-4">
			<div className="space-y-4"> {/* Changed from space-y-6 to space-y-4 for 16px spacing */}
				<CompactIndexerDashboard
					trackerHeight={indexerResponse?.data?.trackerBlockHeight}
					latestHeight={indexerResponse?.data?.latestBlockHeight}
					percentIndexed={percentIndexed}
					isLoading={indexerLoading}
					error={indexerError}
				/>
				{address && <TokenBalances />}
				
				<MintFee /> {/* Add the new MintFee component */}

				{tokenLoading ? (
					<p>Loading token information...</p>
				) : tokenError ? (
					<p>Error loading token information. Please try again later.</p>
				) : (
					tokenResponse &&
					tokenResponse.data && (
						<TokenList
							tokens={tokenResponse.data.tokens}
							total={tokenResponse.data.total}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/>
					)
				)}
			</div>
		</div>
	)
}
