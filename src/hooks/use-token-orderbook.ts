import useSWR from 'swr'
import { TokenData } from '@/hooks/use-token'
import { API_URL, ContractType } from '@/lib/constants'
import axios from 'axios'
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

interface TokenUtxoResponse {
	code: number
	msg: string
	data: TokenUtxo
}

export async function getTokenUtxo(txid: string, vout: number) {
	const res = await axios.get(`${API_URL}/api/orderbook/token/${txid}/${vout}`)
	const data = res.data as TokenUtxoResponse
	return data.data as TokenUtxo
}

// Define the structure of an orderbook entry
export interface OrderbookEntry {
	txid: string
	outputIndex: number
	tokenPubKey: string
	tokenTxid: string
	tokenOutputIndex: number
	tokenAmount: string
	ownerPubKey: string
	price: string
	spendTxid: string | null
	spendInputIndex: number | null
	spendCreatedAt: string | null
	spendBlockHeight: number | null
	takerPubKey: string | null
	blockHeight: number
	createdAt: string
	fillAmount: string | null
	status: 'open' | 'filled' | 'canceled' | 'partially_filled' | 'partially_open'
	genesisTxid: string | null
	genesisOutputIndex: number | null
	md5: string
}

export const BUY_MD5 = ContractType.FXPCAT20_BUY
export const SELL_MD5 = ContractType.FXPCAT20_SELL

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
		token ? `${API_URL}/api/orderbook/${token.tokenId}/utxos` : null,
		orderbookFetcher,
		{ refreshInterval: 5000 } // Refresh every 5 seconds
	)

	// @ts-ignore
	const sellOrders = orderbookData?.data?.utxos.filter(order => order.md5 === SELL_MD5) || []
	// @ts-ignore
	const buyOrders = orderbookData?.data?.utxos.filter(order => order.md5 === BUY_MD5) || []

	// Calculate total amount and best price for sell orders
	const { totalSellAmount, bestSellPrice } = sellOrders.reduce(
		(acc, order) => {
			const price = parseFloat(order.price)
			const amount = parseInt(order.tokenAmount)
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
