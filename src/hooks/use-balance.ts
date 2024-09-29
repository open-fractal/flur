import useSWR from 'swr'
import { useWallet } from '@/lib/unisat'
import { API_URL } from '@/lib/constants'
import { TokenData } from '@/hooks/use-token'

interface Balance {
	tokenId: string
	confirmed: string
}

interface BalanceResponse {
	code: number
	msg: string
	data?: {
		balances: Balance[]
		trackerBlockHeight: number
	}
}

const formatBalance = (balance: string, decimals: number): string => {
	const balanceNum = parseInt(balance)
	const scaledBalance = balanceNum / Math.pow(10, decimals)
	return scaledBalance.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})
}

export function useBalance(token: TokenData) {
	const { address, balance: fbBalance } = useWallet()

	// Define the fetcher function
	const fetcher = async (url: string): Promise<BalanceResponse> => {
		const response = await fetch(url)
		const data: BalanceResponse = await response.json()
		if (data.code !== 0 || !data.data?.balances) {
			throw new Error('Failed to fetch balance data')
		}
		return data
	}

	// Use SWR for data fetching
	const { data, error } = useSWR<BalanceResponse, Error>(
		address ? `${API_URL}/api/addresses/${address}/balances` : null,
		fetcher
	)

	// Process the fetched data
	const tokenBalance =
		data && token
			? formatBalance(
					data.data?.balances.find(b => b.tokenId === token.tokenId)?.confirmed || '0',
					token.decimals
			  )
			: '0'

	const fbBalanceFormatted = (fbBalance.total / 1e8).toFixed(8)

	return {
		fbBalance: fbBalanceFormatted,
		tokenBalance,
		tokenSymbol: token?.symbol,
		isLoading: !error && !data,
		isError: error,
		trackerBlockHeight: data?.data?.trackerBlockHeight
	}
}
