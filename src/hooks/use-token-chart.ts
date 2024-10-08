import useSWR from 'swr'
import { API_URL } from '@/lib/constants'
import { TokenData } from '@/hooks/use-token'
import { useMemo } from 'react'

// Define the structure of a single candle data point
interface CandleData {
	open: number
	high: number
	low: number
	close: number
	time: number
}

// Define the structure of the API response
interface ChartResponse {
	code: number
	msg: string
	data: CandleData[]
}

/**
 * Fetches chart data for a specific token
 * @param tokenId - The ID of the token
 * @returns Promise with the chart data
 */
const fetchTokenChart = async (id: string, timeframe: string = '12h'): Promise<CandleData[]> => {
	const response = await fetch(`${API_URL}/api/orderbook/${id}/chart?timeframe=${timeframe}`)
	const data: ChartResponse = await response.json()

	if (data.code !== 0 || !Array.isArray(data.data)) {
		throw new Error(data.msg || 'Failed to fetch token chart data')
	}

	return data.data
}

/**
 * Custom hook to fetch and manage token chart data
 * @param tokenData - The token data object
 * @returns Object containing chart data, loading state, and error state
 */
export function useTokenChart(tokenData: TokenData, timeframe: string) {
	const { data, error } = useSWR<CandleData[], Error>(
		tokenData ? [`tokenChart`, tokenData.tokenId, timeframe] : null,
		([, id, timeframe]) => fetchTokenChart(id as string, timeframe as string), // Type assertion to fix the error
		{
			refreshInterval: 60000 // Refresh every minute
		}
	)

	// Memoize and scale the chart data
	const scaledChartData = useMemo(() => {
		if (!data || !tokenData.decimals) return []

		const scaleFactor = 1e8 / Math.pow(10, tokenData.decimals)

		return data.map(candle => ({
			...candle,
			open: candle.open / scaleFactor,
			high: candle.high / scaleFactor,
			low: candle.low / scaleFactor,
			close: candle.close / scaleFactor
		}))
	}, [data, tokenData.decimals])

	return {
		chartData: scaledChartData,
		isLoading: !error && !data,
		isError: !!error
	}
}
