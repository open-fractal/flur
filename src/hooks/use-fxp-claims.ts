import useSWR from 'swr'
import { useWallet } from '@/lib/unisat'
import { API_URL } from '@/lib/constants'

interface FXPClaimsResponse {
	code: number
	msg: string
	data?: {
		count: number
	}
}

/**
 * Custom hook to fetch the count of FXP claims for the current wallet address
 * @returns An object containing the claim count, loading state, and error state
 */
export function useFXPClaims() {
	const { address } = useWallet()

	// Define the fetcher function
	const fetcher = async (url: string): Promise<FXPClaimsResponse> => {
		const response = await fetch(url)
		const data: FXPClaimsResponse = await response.json()
		if (data.code !== 0 || typeof data.data?.count !== 'number') {
			throw new Error('Failed to fetch FXP claims data')
		}
		return data
	}

	// Use SWR for data fetching
	const { data, error } = useSWR<FXPClaimsResponse, Error>(
		address ? `${API_URL}/api/orderbook/address/${address}/fxp-claim-count` : null,
		fetcher
	)

	return {
		claimCount: data?.data?.count ?? 0,
		isLoading: !error && !data,
		isError: error
	}
}
