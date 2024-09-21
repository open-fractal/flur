'use client'

import { useEffect } from 'react'

export interface UnisatAPI {
	getAccounts: () => Promise<string[]>
	requestAccounts: () => Promise<string[]>
	getNetwork: () => Promise<string>
	getPublicKey: () => Promise<string>
	getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>
	signMessage: (message: string, type: 'ecdsa' | 'bip322-simple') => Promise<string>
	signPsbt: (psbtHex: string) => Promise<string>
	getBitcoinUtxos: () => Promise<
		{ txid: string; vout: number; satoshis: number; scriptPk: string }[]
	>
	on: (event: string, callback: (...args: any[]) => void) => void
	removeListener: (event: string, callback: (...args: any[]) => void) => void // Added removeListener method,
	pushTx: (txHex: string) => Promise<string>
}

import useSWR from 'swr'

const fetchWalletData = async () => {
	if (typeof window.unisat === 'undefined') {
		return {
			address: '',
			isWalletConnected: false,
			balance: { confirmed: 0, unconfirmed: 0, total: 0 }
		}
	}

	const accounts = await window.unisat.getAccounts()
	if (accounts.length === 0) {
		return {
			address: '',
			isWalletConnected: false,
			balance: { confirmed: 0, unconfirmed: 0, total: 0 }
		}
	}

	const address = accounts[0]
	const balance = await window.unisat.getBalance()

	return { address, isWalletConnected: true, balance }
}

export const useWallet = () => {
	const { data, mutate } = useSWR('wallet', fetchWalletData, {
		refreshInterval: 5000, // Refresh every 5 seconds
		revalidateOnFocus: false
	})

	const setAddress = (newAddress: string) => {
		// @ts-ignore
		mutate({ ...data, address: newAddress }, false)
	}

	const setIsWalletConnected = (isConnected: boolean) => {
		// @ts-ignore
		mutate({ ...data, isWalletConnected: isConnected }, false)
	}

	// New function to update balance
	const updateBalance = async () => {
		if (data?.isWalletConnected) {
			const balance = await window.unisat.getBalance()
			mutate({ ...data, balance }, false)
		}
	}

	// Set up event listener for account changes
	useEffect(() => {
		const handleAccountsChanged = async (accounts: string[]) => {
			if (accounts.length > 0) {
				const balance = await window.unisat.getBalance()
				mutate({ address: accounts[0], isWalletConnected: true, balance }, false)
			} else {
				mutate(
					{
						address: '',
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
		isWalletConnected: data?.isWalletConnected || false,
		balance: data?.balance || { confirmed: 0, unconfirmed: 0, total: 0 },
		setAddress,
		setIsWalletConnected,
		updateBalance
	}
}
