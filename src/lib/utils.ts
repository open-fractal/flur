import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'
import { MEMPOOL_URL } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number | string): string => {
  return Number(num).toLocaleString();
};

export const validateTokenId = (tokenId: string): boolean => {
  // Validate token ID format: 64 hex characters followed by an underscore and a number
  return /^[a-fA-F0-9]{64}_\d+$/.test(tokenId);
}

export const getFeeRate = async function(): Promise<number> {
	try {
		const url = `${MEMPOOL_URL}/fees/recommended`
		const response = await axios.get(url)
		const feeRate = response.data

		if (!feeRate) {
			return 2
		}

		return Math.max(2, feeRate['fastestFee'] || 1)
	} catch (error) {
		console.error(`fetch feeRate failed:`, error)
		return 2 // Default fee rate if request fails
	}
}

export async function broadcast(txHex: string): Promise<string | Error> {
	const url = `${MEMPOOL_URL}/tx`
	try {
		const response = await axios.post(url, txHex, {
			headers: {
				'Content-Type': 'text/plain'
			}
		})

		return response.data
	} catch (error) {
		console.error('broadcast failed!', error)
		return error as Error
	}
}
