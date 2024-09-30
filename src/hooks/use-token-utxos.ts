import useSWR from 'swr'
import { useWallet } from '@/lib/unisat'
import { API_URL } from '@/lib/constants'
import { TokenData } from '@/hooks/use-token'

// Define the structure of a UTXO
interface Utxo {
	txId: string
	outputIndex: number
	script: string
	satoshis: string
}

// Define the structure of a UTXO state
interface UtxoState {
	address: string
	amount: string
}

// Define the structure of a UTXO with its state
interface UtxoWithState {
	utxo: Utxo
	txoStateHashes: string[]
	state: UtxoState
}

// Define the structure of the API response
interface UtxoResponse {
	code: number
	msg: string
	data?: {
		utxos: UtxoWithState[]
		trackerBlockHeight: number
	}
}

export function useTokenUtxos(token: TokenData) {
	const { address } = useWallet()

	// Define the fetcher function
	const fetcher = async (url: string): Promise<UtxoResponse> => {
		const response = await fetch(url)
		const data: UtxoResponse = await response.json()
		if (data.code !== 0 || !data.data?.utxos) {
			throw new Error('Failed to fetch UTXO data')
		}
		return data
	}

	// Use SWR for data fetching
	const { data, error } = useSWR<UtxoResponse, Error>(
		address && token ? `${API_URL}/api/tokens/${token.tokenId}/addresses/${address}/utxos` : null,
		fetcher
	)

	// Process the fetched data
	const utxos = data?.data?.utxos || []

	// Calculate total token amount from UTXOs
	const totalAmount = utxos.reduce((sum, utxo) => sum + parseInt(utxo.state.amount), 0)

	// Format the total amount based on token decimals
	const formattedTotalAmount = (totalAmount / Math.pow(10, token.decimals)).toFixed(token.decimals)

	return {
		utxos,
		totalAmount: formattedTotalAmount,
		isLoading: !error && !data,
		isError: error,
		trackerBlockHeight: data?.data?.trackerBlockHeight
	}
}
