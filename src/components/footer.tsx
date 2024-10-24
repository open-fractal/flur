'use client'
import useSWR from 'swr'
import { API_URL } from '@/lib/constants'

interface ApiResponse {
	code: number
	msg: string
	data: {
		trackerBlockHeight: number
		latestBlockHeight: number
	}
}

const INDEXER_API_ENDPOINT = `${API_URL}/api`
const fetcher = (url: string) => fetch(url).then(res => res.json())

export function Footer() {
	const { data } = useSWR<ApiResponse>(INDEXER_API_ENDPOINT, fetcher, {
		refreshInterval: 5000
	})

	const percentIndexed =
		data && data.data
			? ((data.data.trackerBlockHeight / data.data.latestBlockHeight) * 100).toFixed(2)
			: null

	const trackerHeight = data?.data?.trackerBlockHeight
	const latestHeight = data?.data?.latestBlockHeight

	return (
		<div className="w-full border-t h-8 fixed bottom-0 left-0 bg-black">
			<div className="px-4 flex items-center justify-between h-full">
				<div></div>
				{/* <div className="text-xs text-gray-500">Service Fee: 0 Sats</div> */}
				<div className="flex gap-2 h-full items-center">
					<p className="text-xs whitespace-nowrap text-gray-500">
						Indexed: <span className="font-bold">{trackerHeight}</span> /{' '}
						<span className="font-bold">{latestHeight}</span> ({percentIndexed || '0'}%)
					</p>
				</div>
			</div>
		</div>
	)
}
