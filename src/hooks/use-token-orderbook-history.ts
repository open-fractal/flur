import useSWR from 'swr'
import { TokenData } from '@/hooks/use-token'
import { API_URL } from '@/lib/constants'
import { OrderbookResponse } from './use-token-orderbook'

export function useTokenOrderbookHistory(token: TokenData) {
	// Define the fetcher function for orderbook history data
	const orderbookHistoryFetcher = async (url: string): Promise<OrderbookResponse> => {
		const response = await fetch(url)
		const data: OrderbookResponse = await response.json()
		if (data.code !== 0 || !data.data?.utxos) {
			throw new Error('Failed to fetch orderbook history data')
		}
		return data
	}

	// Use SWR for orderbook history data fetching with a 5-second refresh interval
	const { data: orderbookHistoryData, error: orderbookHistoryError } = useSWR<
		OrderbookResponse,
		Error
	>(token ? `${API_URL}/api/orderbook/${token.tokenId}/history` : null, orderbookHistoryFetcher, {
		refreshInterval: 5000, // Refresh every 5 seconds
		dedupingInterval: 1000 // Dedupe requests within 1 second
	})

	// Process the fetched orderbook history data
	const historyEntries = orderbookHistoryData?.data?.utxos || []

	return {
		historyEntries,
		isLoading: !orderbookHistoryError && !orderbookHistoryData,
		isError: orderbookHistoryError,
		trackerBlockHeight: orderbookHistoryData?.data?.trackerBlockHeight
	}
}
