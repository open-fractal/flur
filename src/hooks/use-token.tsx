import useSWR from 'swr'
import { API_URL } from '@/lib/constants'

export interface TokenData {
	minterAddr: string
	tokenAddr: string
	info: {
		max: string
		name: string
		limit: string
		symbol: string
		premine: string
		decimals: number
		minterMd5: string
	}
	tokenId: string
	revealTxid: string
	revealHeight: number
	genesisTxid: string
	name: string
	symbol: string
	decimals: number
	minterPubKey: string
	tokenPubKey: string
	currentSupply: string
	supply: number
	holders: number
	totalVolume: string
	weeklyVolume: string
	dailyVolume: string
	lastPrice: string
	marketCap: string
}

interface TokenResponse {
	code: number
	msg: string
	data: TokenData
}

const fetcher = (url: string) =>
	fetch(url).then(res => {
		if (!res.ok) throw new Error('Network response was not ok')
		return res.json()
	})

export function useToken(tokenId: string) {
	const { data, error } = useSWR<TokenResponse>(`${API_URL}/api/tokens/${tokenId}`, fetcher, {
		refreshInterval: 10000, // Refetch every 10 seconds
		dedupingInterval: 5000 // Dedupe requests within 5 seconds
	})

	return {
		token: data?.data,
		isLoading: !error && !data,
		isError: error
	}
}
