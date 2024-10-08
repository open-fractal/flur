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
export interface OrderbookEntry {
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
	fillAmount: string | null
	status: 'open' | 'filled' | 'canceled' | 'partially_filled' | 'partially_open'
	genesisTxid: string | null
	genesisOutputIndex: number | null
}

// Define the structure of the API response
interface OrderbookResponse {
	code: number
	msg: string
	data: {
		utxos: OrderbookEntry[]
		trackerBlockHeight: number
	}
}

// Move the orderbookFetcher outside of the hook
const orderbookFetcher = async (url: string): Promise<OrderbookResponse> => {
	const response = await fetch(url)
	const data: OrderbookResponse = await response.json()
	if (data.code !== 0 || !data.data?.utxos) {
		throw new Error('Failed to fetch orderbook data')
	}
	return data
}

export function useTokenOrderbook(token: TokenData) {
	const { data: orderbookData, error: orderbookError } = useSWR<OrderbookResponse, Error>(
		token ? `${API_URL}/api/orderbook/${token.tokenId}/utxos?limit=1000000&offset=0` : null,
		orderbookFetcher,
		{ refreshInterval: 5000 } // Refresh every 5 seconds
	)

	const sellOrders = orderbookData?.data?.utxos || []
	const buyOrders: OrderbookEntry[] = [] // Empty for now

	// Calculate total amount and best price for sell orders
	const { totalSellAmount, bestSellPrice } = sellOrders.reduce(
		(acc, order) => {
			const price = parseFloat(order.price)
			const amount = parseInt(order.tokenUtxo.state.amount)
			return {
				totalSellAmount: acc.totalSellAmount + amount,
				bestSellPrice: Math.min(acc.bestSellPrice, price)
			}
		},
		{ totalSellAmount: 0, bestSellPrice: Infinity }
	)

	// Format the total amount based on token decimals
	const formattedTotalSellAmount = (totalSellAmount / Math.pow(10, token.decimals)).toFixed(
		token.decimals
	)

	return {
		sellOrders,
		buyOrders,
		totalSellAmount: formattedTotalSellAmount,
		totalBuyAmount: '0', // No buy orders yet
		bestSellPrice: bestSellPrice !== Infinity ? bestSellPrice : 0,
		bestBuyPrice: 0, // No buy orders yet
		isLoading: !orderbookError && !orderbookData,
		isError: !!orderbookError,
		trackerBlockHeight: orderbookData?.data?.trackerBlockHeight
	}
}

// Make sure to export the OrderbookResponse interface
export type { OrderbookResponse }
