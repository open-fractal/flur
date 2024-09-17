'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import React, { useState, useEffect, createContext } from 'react'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const WalletContext = createContext<{
	address: string
	setAddress: (address: string) => void
	isWalletConnected: boolean
	setIsWalletConnected: (isConnected: boolean) => void
}>({
	address: '',
	setAddress: () => {},
	isWalletConnected: false,
	setIsWalletConnected: () => {}
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [address, setAddress] = useState('')
	const [isWalletConnected, setIsWalletConnected] = useState(false)

	useEffect(() => {
		const checkWalletConnection = async () => {
			if (typeof window.unisat !== 'undefined') {
				try {
					const accounts = await window.unisat.getAccounts()
					if (accounts.length > 0) {
						setIsWalletConnected(true)
						setAddress(accounts[0])
					}
				} catch (error) {
					console.error('Error checking wallet connection:', error)
				}
			}
		}

		const handleAccountsChanged = (accounts: string[]) => {
			if (accounts.length > 0) {
				setIsWalletConnected(true)
				setAddress(accounts[0])
			} else {
				setIsWalletConnected(false)
				setAddress('')
			}
		}

		checkWalletConnection()

		if (typeof window.unisat !== 'undefined') {
			window.unisat.on('accountsChanged', handleAccountsChanged)
		}

		return () => {
			if (typeof window.unisat !== 'undefined') {
				window.unisat.removeListener('accountsChanged', handleAccountsChanged)
			}
		}
	}, [])

	return (
		<html lang="en">
			<head>
				<title>Flur – A Fractal Bitcoin company</title>
				<meta
					name="description"
					content="Developing applications and infrastructure on Fractal Bitcoin."
				/>
				<meta property="og:image" content="https://flur.gg/unfurl.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:image" content="https://flur.gg/unfurl.png" />
			</head>
			<body className={inter.className}>
				<WalletContext.Provider
					value={{ address, setAddress, isWalletConnected, setIsWalletConnected }}
				>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex-grow">{children}</main>
						<footer className="flex justify-center items-center py-4"></footer>
						<Toaster />
					</div>
				</WalletContext.Provider>
			</body>
		</html>
	)
}
