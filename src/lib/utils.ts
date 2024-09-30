import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'
import { MEMPOOL_URL } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(n)) return '0';

  const absN = Math.abs(n);

  const format = (value: number, suffix: string) => {
    const formatted = value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    });
    // Remove trailing .00 if present
    return formatted.replace(/\.00$/, '') + suffix;
  };

  if (absN >= 1e15) return format(n / 1e15, 'Q');
  if (absN >= 1e12) return format(n / 1e12, 'T');
  if (absN >= 1e9) return format(n / 1e9, 'B');
  if (absN >= 1e6) return format(n / 1e6, 'M');
  if (absN >= 1e3) return format(n / 1e3, 'K');

  return n.toLocaleString(undefined, { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  });
}

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

export const satsToBTC = (sats: number): number => {
  return sats / 1e8
}

export const btcToSats = (btc: number): number => {
  return Math.floor(btc * 1e8)
}

// Add this function to validate taproot addresses
export function validateTaprootAddress(address: string): boolean {
  // Taproot addresses always start with 'bc1p'
  if (!address.startsWith('bc1p')) {
    return false
  }
  
  // Taproot addresses are always 62 characters long
  if (address.length !== 62) {
    return false
  }
  
  // Additional checks can be added here if needed
  
  return true
}
