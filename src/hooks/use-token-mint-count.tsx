import useSWR from 'swr'
import { API_URL } from '@/lib/constants'

interface UtxoCountResponse {
	code: number
	msg: string
	data: {
		count: number
	}
}

const fetcher = (url: string) =>
	fetch(url).then(res => {
		if (!res.ok) throw new Error('Network response was not ok')
		return res.json()
	})

export function useTokenMintCount(tokenId: string) {
	const { data, error } = useSWR<UtxoCountResponse>(
		`${API_URL}/api/minters/${tokenId}/mintCount`,
		fetcher,
		{
			refreshInterval: 10000, // Refetch every 10 seconds
			dedupingInterval: 5000 // Dedupe requests within 5 seconds
		}
	)

	return {
		mintCount: data?.data?.count,
		isLoading: !error && !data,
		isError: error
	}
}
