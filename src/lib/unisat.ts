'use client'

import { useEffect } from 'react'
import useSWR from 'swr'

export interface UnisatAPI {
	getAccounts: () => Promise<string[]>
	requestAccounts: () => Promise<string[]>
	getNetwork: () => Promise<string>
	getPublicKey: () => Promise<string>
	getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>
	signMessage: (message: string, type: 'ecdsa' | 'bip322-simple') => Promise<string>
	signPsbt: (
		psbtHex: string,
		options?: {
			autoFinalized: boolean
			toSignInputs: Array<{
				index: number
				address?: string
				publicKey?: string
				sighashTypes?: number[]
				disableTweakSigner?: boolean
			}>
		}
	) => Promise<string>
	signPsbts: (
		psbtHexs: string[],
		options?: Array<{
			autoFinalized: boolean
			toSignInputs: Array<{
				index: number
				address?: string
				publicKey?: string
				sighashTypes?: number[]
				disableTweakSigner?: boolean
			}>
		}>
	) => Promise<string[]>
	getBitcoinUtxos: () => Promise<
		{ txid: string; vout: number; satoshis: number; scriptPk: string }[]
	>
	switchChain: (chain: string) => Promise<any>
	on: (event: string, callback: (...args: any[]) => void) => void
	removeListener: (event: string, callback: (...args: any[]) => void) => void
}

const fetchWalletData = async () => {
	if (typeof window.unisat === 'undefined') {
		return {
			address: '',
			publicKey: '',
			isWalletConnected: false,
			balance: { confirmed: 0, unconfirmed: 0, total: 0 }
		}
	}

	try {
		const accounts = await window.unisat.getAccounts()
		const address = accounts[0] || ''
		const publicKey = await window.unisat.getPublicKey()
		const balance = await window.unisat.getBalance()

		const { btc } = await import('@/lib/scrypt/common')

		const xOnlyPublicKey = btc.Script.fromAddress(address)
			.getPublicKeyHash()
			.toString('hex')

		return {
			address,
			publicKey,
			xOnlyPublicKey,
			isWalletConnected: !!address,
			balance
		}
	} catch (error) {
		console.error('Error fetching wallet data:', error)
		return {
			address: '',
			publicKey: '',
			xOnlyPublicKey: '',
			isWalletConnected: false,
			balance: { confirmed: 0, unconfirmed: 0, total: 0 }
		}
	}
}

export const useWallet = () => {
	const { data, mutate } = useSWR('wallet', fetchWalletData, {
		revalidateOnFocus: false,
		shouldRetryOnError: false // Add this to prevent infinite retries on error
	})

	const setAddress = (newAddress: string) => {
		// @ts-ignore
		mutate({ ...data, address: newAddress }, false)
	}

	const setPublicKey = (newPublicKey: string) => {
		// @ts-ignore
		mutate({ ...data, publicKey: newPublicKey }, false)
	}

	const setIsWalletConnected = (isConnected: boolean) => {
		// @ts-ignore
		mutate({ ...data, isWalletConnected: isConnected }, false)
	}

	const updateBalance = async () => {
		if (data?.isWalletConnected) {
			const balance = await window.unisat.getBalance()
			mutate({ ...data, balance }, false)
		}
	}

	const disconnectWallet = () => {
		// Reset all wallet data to initial state
		mutate(
			{
				address: '',
				publicKey: '',
				xOnlyPublicKey: '',
				isWalletConnected: false,
				balance: { confirmed: 0, unconfirmed: 0, total: 0 }
			},
			false
		)
	}

	const connectWallet = async () => {
		try {
			const accounts = await window.unisat.requestAccounts()
			if (accounts.length > 0) {
				const publicKey = await window.unisat.getPublicKey()
				const balance = await window.unisat.getBalance()

				// Import btc for xOnlyPublicKey calculation
				const { btc } = await import('@/lib/scrypt/common')
				const xOnlyPublicKey = btc.Script.fromAddress(accounts[0])
					.getPublicKeyHash()
					.toString('hex')

				// Update all wallet data at once
				await mutate(
					{
						address: accounts[0],
						publicKey,
						xOnlyPublicKey,
						isWalletConnected: true,
						balance
					},
					false
				)
			}
		} catch (error) {
			console.error('Error connecting wallet:', error)
			// Reset state on error
			await mutate(
				{
					address: '',
					publicKey: '',
					xOnlyPublicKey: '',
					isWalletConnected: false,
					balance: { confirmed: 0, unconfirmed: 0, total: 0 }
				},
				false
			)
			throw error // Rethrow to handle in component
		}
	}

	useEffect(() => {
		const handleAccountsChanged = async (accounts: string[]) => {
			if (accounts.length > 0) {
				const publicKey = await window.unisat.getPublicKey()
				const balance = await window.unisat.getBalance()
				mutate({ address: accounts[0], publicKey, isWalletConnected: true, balance }, false)
			} else {
				mutate(
					{
						address: '',
						publicKey: '',
						xOnlyPublicKey: '',
						isWalletConnected: false,
						balance: { confirmed: 0, unconfirmed: 0, total: 0 }
					},
					false
				)
			}
		}

		if (typeof window.unisat !== 'undefined') {
			window.unisat.on('accountsChanged', handleAccountsChanged)
		}

		return () => {
			if (typeof window.unisat !== 'undefined') {
				window.unisat.removeListener('accountsChanged', handleAccountsChanged)
			}
		}
	}, [mutate])

	return {
		address: data?.address || '',
		publicKey: data?.publicKey || '',
		xOnlyPublicKey: data?.xOnlyPublicKey || '',
		isWalletConnected: data?.isWalletConnected || false,
		balance: data?.balance || { confirmed: 0, unconfirmed: 0, total: 0 },
		setAddress,
		setPublicKey,
		setIsWalletConnected,
		updateBalance,
		disconnectWallet,
		connectWallet // Add this to the returned object
	}
}

export async function getBitcoinUtxoCount(): Promise<number> {
	try {
		const response = await window.unisat.getBitcoinUtxos()
		return response.length
	} catch (error) {
		console.error('Error fetching Bitcoin UTXO count:', error)
		throw error
	}
}
