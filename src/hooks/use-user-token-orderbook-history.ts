import useSWR from 'swr'
import { TokenData } from '@/hooks/use-token'
import { API_URL } from '@/lib/constants'
import { useWallet } from '@/lib/unisat'
import { OrderbookResponse } from './use-token-orderbook'

const fetchUserOrders = async (tokenId: string, address: string): Promise<OrderbookResponse> => {
	const response = await fetch(
		`${API_URL}/api/orderbook/${tokenId}/address/${address}/history?v1=1`
	)
	const data: OrderbookResponse = await response.json()
	if (data.code !== 0 || !data.data?.utxos) {
		throw new Error('Failed to fetch user orders')
	}
	return data
}

export function useUserTokenOrderbookHistory(token: TokenData) {
	const { address } = useWallet()

	const { data: userOrdersData, error: userOrdersError } = useSWR<OrderbookResponse, Error>(
		token && address ? [`${token.tokenId}`, address, 'history'] : null,
		// @ts-ignore
		([tokenId, userAddress]: [string, string]) => fetchUserOrders(tokenId, userAddress),
		{ refreshInterval: 5000 } // Refresh every 5 seconds
	)

	return {
		userOrders: userOrdersData?.data?.utxos || [],
		isLoading: !userOrdersError && !userOrdersData,
		isError: !!userOrdersError
	}
}
