'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { useWallet } from '@/lib/unisat'
import { API_URL } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface BalanceResponse {
	code: number
	msg: string
	data: {
		balances: Array<{
			tokenId: string
			confirmed: string
		}>
		trackerBlockHeight: number
	}
}

interface TokenInfo {
	symbol: string
	decimals: number
}

export function TokenBalances() {
	const router = useRouter()
	const { address, setIsWalletConnected, setAddress, updateBalance } = useWallet()
	const [tokenInfo, setTokenInfo] = useState<Map<string, TokenInfo>>(new Map())

	const connectWallet = async () => {
		if (typeof window.unisat !== 'undefined') {
			try {
				const accounts = await window.unisat.requestAccounts()
				setIsWalletConnected(true)
				setAddress(accounts[0])
				updateBalance()
			} catch (error) {
				console.error('Error connecting wallet:', error)
			}
		} else {
			alert('Unisat wallet not detected. Please install the extension.')
		}
	}

	const { data: balanceResponse, error: balanceError } = useSWR<BalanceResponse>(
		address ? `${API_URL}/api/addresses/${address}/balances` : null,
		fetcher
	)

	useEffect(() => {
		if (balanceResponse?.data?.balances) {
			fetchTokenInfo(balanceResponse.data.balances.map(b => b.tokenId))
		}
	}, [balanceResponse])

	const fetchTokenInfo = async (tokenIds: string[]) => {
		const newTokenInfo = new Map<string, TokenInfo>()
		await Promise.all(
			tokenIds.map(async tokenId => {
				try {
					const response = await fetch(`${API_URL}/api/tokens/${tokenId}?v=1`)
					const data = await response.json()
					if (data.code === 0 && data.data) {
						newTokenInfo.set(tokenId, data.data)
					}
				} catch (error) {
					console.error(`Error fetching token info for ${tokenId}:`, error)
				}
			})
		)
		setTokenInfo(newTokenInfo)
	}

	if (!address) {
		return (
			<div className="w-full">
				<div className="py-3 px-4">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-semibold">Token Balances</h2>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center py-8 px-4 text-center">
					<Wallet className="w-12 h-12 mb-4 text-muted-foreground" />
					<p className="text-muted-foreground mb-4">
						Connect your wallet to view your token balances
					</p>
					<Button onClick={connectWallet} variant="default">
						Connect Wallet
					</Button>
				</div>
			</div>
		)
	}
	if (balanceError) return <p>Error loading token balances: {balanceError.message}</p>
	if (!balanceResponse) return <TokenBalancesSkeleton />
	if (!balanceResponse.data) return <p>Invalid response format from the server.</p>
	if (!Array.isArray(balanceResponse.data.balances)) return <p>Invalid balances data received.</p>

	const balances = balanceResponse.data.balances
	const tokenCount = balances.length

	const formatBalance = (balance: string, decimals: number) => {
		const balanceNum = parseInt(balance)
		const scaledBalance = balanceNum / Math.pow(10, decimals)
		return scaledBalance.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})
	}

	const handleRowClick = (tokenId: string) => {
		router.push(`/token/${tokenId}`)
	}

	return (
		<div className="w-full">
			<div className="py-3 px-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">Token Balances ({tokenCount})</h2>
				</div>
			</div>
			<div className="">
				{tokenCount === 0 ? (
					<p>No token balances found.</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Symbol</TableHead>
								<TableHead className="text-right">Balance</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{balances.map(balance => {
								const token = tokenInfo.get(balance.tokenId)
								const formattedBalance = token
									? formatBalance(balance.confirmed, token.decimals)
									: balance.confirmed
								return (
									<TableRow
										key={balance.tokenId}
										className="cursor-pointer hover:bg-muted/50 duration-200"
										onClick={() => handleRowClick(balance.tokenId)}
									>
										<TableCell>{token?.symbol || 'Loading...'}</TableCell>
										<TableCell className="text-right">{formattedBalance}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	)
}

function TokenBalancesSkeleton() {
	return (
		<div className="w-full">
			<div className="py-3 px-4">
				<Skeleton className="h-7 w-[200px]" />
				<Skeleton className="h-4 w-[250px] mt-1" />
			</div>
			<div className="px-4 py-2">
				<div className="space-y-2">
					<div className="flex justify-between">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
					<div className="flex justify-between">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
					<div className="flex justify-between">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
				</div>
			</div>
		</div>
	)
}
