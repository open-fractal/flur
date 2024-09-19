'use client'

import React from 'react'
import useSWR from 'swr'
import { useWallet } from '@/lib/unisat'
import { TokenBalances } from '@/components/token-balances'
import { CompactIndexerDashboard } from '@/components/indexer-status' // Import the new component
import { MintFee } from '@/components/mint-fee' // Import the new component
import { API_URL } from '@/lib/constants'
import { UnisatAPI } from '@/lib/unisat'
import { TokenDataTable } from '@/components/token-data-table'
const INDEXER_API_ENDPOINT = `${API_URL}/api?v=1`

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

declare global {
	interface Window {
		unisat: UnisatAPI
	}
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
	const { address } = useWallet()

	const { data: indexerResponse, error: indexerError, isLoading: indexerLoading } = useSWR<
		ApiResponse
	>(INDEXER_API_ENDPOINT, fetcher, { refreshInterval: 5000 })

	const percentIndexed =
		indexerResponse && indexerResponse.data
			? (
					(indexerResponse.data.trackerBlockHeight / indexerResponse.data.latestBlockHeight) *
					100
			  ).toFixed(2)
			: null

	return (
		<div className="container mx-auto p-4">
			<div className="space-y-4">
				<CompactIndexerDashboard
					trackerHeight={indexerResponse?.data?.trackerBlockHeight}
					latestHeight={indexerResponse?.data?.latestBlockHeight}
					percentIndexed={percentIndexed}
					isLoading={indexerLoading}
					error={indexerError}
				/>
				{address && <TokenBalances />}

				<MintFee />
				<TokenDataTable />
			</div>
		</div>
	)
}
