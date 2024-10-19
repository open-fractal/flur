'use client'

import React, { useState, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { TokenData } from '@/hooks/use-token'
import { useUserTokenOrderbook } from '@/hooks/use-user-token-orderbook'
import { useUserTokenOrderbookHistory } from '@/hooks/use-user-token-orderbook-history'
import { BUY_MD5, SELL_MD5 } from '@/hooks/use-token-orderbook'
import { Loader2 } from 'lucide-react'
import { useWallet } from '@/lib/unisat'
import { useToast } from '@/hooks/use-toast'
import { EXPLORER_URL } from '@/lib/constants'
import { useCancelSellCat20 } from '@/hooks/use-cancel-sell' // Add this import
import { useCancelBuyCat20 } from '@/hooks/use-cancel-buy' // Add this import

// Utility function to format numbers
function formatNumber(num: number, maxDecimals: number): string {
	const parts = num.toFixed(maxDecimals).split('.')
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return parts.join('.').replace(/\.?0+$/, '')
}

export function MyPositions(props: { token: TokenData }) {
	const { toast } = useToast()
	const { token } = props
	const { isWalletConnected, xOnlyPublicKey } = useWallet()
	const { userOrders, isLoading, isError } = useUserTokenOrderbook(token)
	const {
		userOrders: userOrdersHistory,
		isLoading: isHistoryLoading,
		isError: isHistoryError
	} = useUserTokenOrderbookHistory(token)
	const [activeTab, setActiveTab] = useState<'open-orders' | 'history'>('open-orders')
	const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
	const { handleCancelSell } = useCancelSellCat20(token) // Add this line
	const { handleCancelBuy } = useCancelBuyCat20(token) // Add this line

	const connectWallet = async () => {
		if (typeof window.unisat !== 'undefined') {
			try {
				await window.unisat.requestAccounts()
			} catch (error) {
				console.error('Error connecting wallet:', error)
				toast({
					title: 'Error',
					description: 'Failed to connect wallet. Please try again.',
					variant: 'destructive'
				})
			}
		} else {
			toast({
				title: 'Wallet Not Found',
				description: 'Unisat wallet is not installed',
				variant: 'destructive'
			})
		}
	}

	const cancelOrder = useCallback(
		async (order: any) => {
			try {
				setCancellingOrderId(order.txid)
				if (order.md5 === SELL_MD5) {
					await handleCancelSell(order)
				} else if (order.md5 === BUY_MD5) {
					await handleCancelBuy(order)
				} else {
					throw new Error('Unknown order type')
				}
				// Refetch the orders after successful cancellation
			} catch (error) {
				console.error('Error cancelling order:', error)
				toast({
					title: 'Error',
					description: 'Failed to cancel order. Please try again.',
					variant: 'destructive'
				})
			} finally {
				setCancellingOrderId(null)
			}
		},
		[handleCancelSell, handleCancelBuy, toast]
	)

	if (!isWalletConnected) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center">
				<p className="mb-4 text-lg text-gray-300">Connect your wallet to manage positions</p>
				<Button onClick={connectWallet}>Connect Wallet</Button>
			</div>
		)
	}

	const renderContent = () => {
		switch (activeTab) {
			case 'open-orders':
				return renderOpenOrders()
			case 'history':
				return renderHistory()
		}
	}

	const renderOpenOrders = () => {
		if (isLoading || isError || userOrders.length === 0) {
			return (
				<div className="flex items-center justify-center h-full">
					{isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
					{isError && <p>Error loading open orders</p>}
					{!isLoading && !isError && userOrders.length === 0 && <p>No open orders</p>}
				</div>
			)
		}

		return (
			<Table>
				<TableHeader className="sticky top-0 bg-black z-10">
					<TableRow>
						<TableHead>Created Time</TableHead>
						<TableHead>Side</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{userOrders.map((order, index) => {
						// @ts-ignore
						const side = order.md5 === SELL_MD5 ? 'SELL' : 'BUY'
						const price = (parseFloat(order.price) * Math.pow(10, token.decimals)) / 1e8
						const amount = parseInt(order.tokenAmount) / Math.pow(10, token.decimals)
						return (
							<TableRow key={index}>
								<TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
								<TableCell className={side === 'BUY' ? 'text-green-500' : 'text-red-500'}>
									{side}
								</TableCell>
								<TableCell>{formatNumber(price, 8)}</TableCell>
								<TableCell>{formatNumber(amount, token.decimals)}</TableCell>
								<TableCell>{order.status || 'Open'}</TableCell>
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onClick={() => cancelOrder(order)}
										disabled={cancellingOrderId === order.txid}
									>
										{cancellingOrderId === order.txid ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											'Cancel'
										)}
									</Button>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		)
	}

	const renderHistory = () => {
		if (isHistoryLoading || isHistoryError || userOrdersHistory.length === 0) {
			return (
				<div className="flex items-center justify-center h-full">
					{isHistoryLoading && <Loader2 className="w-6 h-6 animate-spin" />}
					{isHistoryError && <p>Error loading order history</p>}
					{!isHistoryLoading && !isHistoryError && userOrdersHistory.length === 0 && (
						<p>No order history</p>
					)}
				</div>
			)
		}

		return (
			<Table>
				<TableHeader className="sticky top-0 bg-black z-10">
					<TableRow>
						<TableHead>Time</TableHead>
						<TableHead>Side</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{userOrdersHistory.map((order, index) => {
						const side =
							order.takerPubKey === xOnlyPublicKey && order.status !== 'canceled' ? 'BUY' : 'SELL'
						const price = (parseFloat(order.price) * Math.pow(10, token.decimals)) / 1e8
						const amount =
							order.status === 'partially_filled' && order.fillAmount
								? parseInt(order.fillAmount) / Math.pow(10, token.decimals)
								: parseInt(order.tokenAmount) / Math.pow(10, token.decimals)
						return (
							<TableRow key={index}>
								<TableCell>
									<a
										href={`${EXPLORER_URL}/tx/${order.spendTxid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{new Date(order.spendCreatedAt || '').toLocaleString()}
									</a>
								</TableCell>
								<TableCell className={side === 'BUY' ? 'text-green-500' : 'text-red-500'}>
									{side}
								</TableCell>
								<TableCell>{formatNumber(price, 8)}</TableCell>
								<TableCell>{formatNumber(amount, token.decimals)}</TableCell>
								<TableCell>{order.status || 'Completed'}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		)
	}

	return (
		<div className="w-full h-full flex flex-col">
			<div className="px-4 pt-4">
				<Tabs value={activeTab} onValueChange={value => setActiveTab(value as typeof activeTab)}>
					<TabsList>
						<TabsTrigger value="open-orders">Open Orders({userOrders.length})</TabsTrigger>
						<TabsTrigger value="history">History({userOrdersHistory.length})</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div className="h-full overflow-y-auto flex flex-col flex-grow">{renderContent()}</div>
		</div>
	)
}
