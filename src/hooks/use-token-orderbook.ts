import useSWR from 'swr'
import { TokenData } from '@/hooks/use-token'
import { API_URL } from '@/lib/constants'
import { useWallet } from '@/lib/unisat'

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
	blockHeight: number
	createdAt: string
	tokenUtxo: TokenUtxo
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

// New function to fetch user's open orders
const fetchUserOrders = async (tokenId: string, address: string): Promise<OrderbookResponse> => {
	const response = await fetch(`${API_URL}/api/orderbook/${tokenId}/address/${address}`)
	const data: OrderbookResponse = await response.json()
	if (data.code !== 0 || !data.data?.utxos) {
		throw new Error('Failed to fetch user orders')
	}
	return data
}

export function useTokenOrderbook(token: TokenData) {
	const { address } = useWallet()

	// Define the fetcher function for orderbook data
	const orderbookFetcher = async (url: string): Promise<OrderbookResponse> => {
		const response = await fetch(url)
		const data: OrderbookResponse = await response.json()
		if (data.code !== 0 || !data.data?.utxos) {
			throw new Error('Failed to fetch orderbook data')
		}
		return data
	}

	// Use SWR for orderbook data fetching
	const { data: orderbookData, error: orderbookError } = useSWR<OrderbookResponse, Error>(
		token ? `${API_URL}/api/orderbook/${token.tokenId}/utxos?limit=1000000&offset=0` : null,
		orderbookFetcher
	)

	// Use SWR for user's open orders fetching
	const { data: userOrdersData, error: userOrdersError } = useSWR<OrderbookResponse, Error>(
		token && address ? [`${token.tokenId}`, address] : null,
		([tokenId, userAddress]) => fetchUserOrders(tokenId, userAddress)
	)

	// Process the fetched orderbook data
	const sellOrders = orderbookData?.data?.utxos || []
	const buyOrders: OrderbookEntry[] = [] // Empty for now

	// Calculate total amount and best price for sell orders
	let totalSellAmount = 0
	let bestSellPrice = Infinity

	sellOrders.forEach(order => {
		const price = parseFloat(order.price)
		const amount = parseInt(order.tokenUtxo.state.amount)
		totalSellAmount += amount
		if (price < bestSellPrice) {
			bestSellPrice = price
		}
	})

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
		isLoading: (!orderbookError && !orderbookData) || (!userOrdersError && !userOrdersData),
		isError: orderbookError || userOrdersError,
		trackerBlockHeight: orderbookData?.data?.trackerBlockHeight,
		userOrders: userOrdersData?.data?.utxos || [] // New field for user's open orders
	}
}
