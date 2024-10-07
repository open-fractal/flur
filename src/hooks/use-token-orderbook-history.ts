import useSWR from 'swr'
import { TokenData } from '@/hooks/use-token'
import { API_URL } from '@/lib/constants'

// Define the structure of a token UTXO
interface TokenUtxo {
	utxo: {
		txId: string
		outputIndex: number
		script: string
		satoshis: string
	}
	txoStateHashes: string[]
	state: {
		address: string
		amount: string
	}
}

// Define the structure of an orderbook entry
export interface OrderbookHistoryEntry {
	txid: string
	outputIndex: number
	tokenPubKey: string
	tokenTxid: string
	tokenOutputIndex: number
	ownerPubKey: string
	price: string
	spendTxid: string | null
	spendInputIndex: number | null
	spendCreatedAt: string | null
	spendBlockHeight: number | null
	takerPubKey: string | null
	blockHeight: number
	createdAt: string
	tokenUtxo: TokenUtxo
}

// Define the structure of the API response
interface OrderbookHistoryResponse {
	code: number
	msg: string
	data: {
		utxos: OrderbookHistoryEntry[]
		trackerBlockHeight: number
	}
}

export function useTokenOrderbookHistory(token: TokenData) {
	// Define the fetcher function for orderbook history data
	const orderbookHistoryFetcher = async (url: string): Promise<OrderbookHistoryResponse> => {
		const response = await fetch(url)
		const data: OrderbookHistoryResponse = await response.json()
		if (data.code !== 0 || !data.data?.utxos) {
			throw new Error('Failed to fetch orderbook history data')
		}
		return data
	}

	// Use SWR for orderbook history data fetching with a 5-second refresh interval
	const { data: orderbookHistoryData, error: orderbookHistoryError } = useSWR<
		OrderbookHistoryResponse,
		Error
	>(
		token ? `${API_URL}/api/orderbook/${token.tokenId}/history?limit=1000000&offset=0` : null,
		orderbookHistoryFetcher,
		{
			refreshInterval: 5000, // Refresh every 5 seconds
			dedupingInterval: 1000 // Dedupe requests within 1 second
		}
	)

	// Process the fetched orderbook history data
	const historyEntries = orderbookHistoryData?.data?.utxos || []

	return {
		historyEntries,
		isLoading: !orderbookHistoryError && !orderbookHistoryData,
		isError: orderbookHistoryError,
		trackerBlockHeight: orderbookHistoryData?.data?.trackerBlockHeight
	}
}
