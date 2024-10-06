'use client'

import React, { useState } from 'react'
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
import { useTokenOrderbook } from '@/hooks/use-token-orderbook'
import { Loader2 } from 'lucide-react' // Add this import

type Order = {
	createdTime: string
	lastUpdate: string
	side: 'BUY' | 'SELL'
	price: number
	filledQuantity: number
	status: string
}

type Trade = {
	time: string
	side: 'BUY' | 'SELL'
	price: number
	quantity: number
	totalWithFee: number
}

// Add this utility function at the top of the file
function formatNumber(num: number, maxDecimals: number): string {
	const parts = num.toFixed(maxDecimals).split('.')
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return parts.join('.').replace(/\.?0+$/, '')
}

function generateDefaultData(): { orderHistoryData: Order[]; tradeHistoryData: Trade[] } {
	const orderHistoryData: Order[] = []
	const tradeHistoryData: Trade[] = []

	for (let i = 0; i < 100; i++) {
		const side: 'BUY' | 'SELL' = Math.random() < 0.5 ? 'BUY' : 'SELL'
		const date = new Date()
		date.setDate(date.getDate() - Math.floor(Math.random() * 30)) // Random date within last 30 days

		// Generate Order
		orderHistoryData.push({
			createdTime: date.toLocaleString(),
			lastUpdate: new Date(date.getTime() + Math.random() * 600000).toLocaleString(), // 0-10 minutes later
			side: side,
			price: Number((Math.random() * 2 + 0.5).toFixed(6)), // Random price between 0.5 and 2.5
			filledQuantity: Number((Math.random() * 1000 + 100).toFixed(8)), // Random quantity between 100 and 1100
			status: 'Filled'
		})

		// Generate Trade
		const quantity = Number((Math.random() * 100 + 10).toFixed(4)) // Random quantity between 10 and 110
		const price = Number((Math.random() * 2 + 0.5).toFixed(6)) // Random price between 0.5 and 2.5
		tradeHistoryData.push({
			time: date.toLocaleString(),
			side: side,
			price: price,
			quantity: quantity,
			totalWithFee: Number((quantity * price * 1.001).toFixed(10)) // Assuming 0.1% fee
		})
	}

	return { orderHistoryData, tradeHistoryData }
}

const { tradeHistoryData } = generateDefaultData()

// Placeholder function for canceling orders
const cancelOrder = async (orderId: string) => {
	console.log(`Canceling order with ID: ${orderId}`)
	// TODO: Implement actual order cancellation logic
	alert('Order cancellation not implemented yet')
}

export function MyPositions(props: { token: TokenData }) {
	const { token } = props
	const { userOrders, isLoading, isError } = useTokenOrderbook(token)
	const [activeTab, setActiveTab] = useState<'open-orders' | 'history'>('open-orders')

	// Remove the openOrders combination as we'll use userOrders directly

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
						const side = order.price ? 'SELL' : 'BUY'
						const price = (parseFloat(order.price) * Math.pow(10, token.decimals)) / 1e8
						const amount = parseInt(order.tokenUtxo.state.amount) / Math.pow(10, token.decimals)
						return (
							<TableRow key={index}>
								<TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
								<TableCell className={side === 'BUY' ? 'text-green-500' : 'text-red-500'}>
									{side}
								</TableCell>
								<TableCell>{formatNumber(price, 8)}</TableCell>
								<TableCell>{formatNumber(amount, token.decimals)}</TableCell>
								<TableCell>Open</TableCell>
								<TableCell>
									<Button variant="destructive" size="sm" onClick={() => cancelOrder(order.txid)}>
										Cancel
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
		return (
			<Table>
				<TableHeader className="sticky top-0 bg-black z-10">
					<TableRow>
						<TableHead>Time</TableHead>
						<TableHead>Side</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Total w/ Fee</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tradeHistoryData.map((trade, index) => (
						<TableRow key={index}>
							<TableCell>{trade.time}</TableCell>
							<TableCell className={trade.side === 'BUY' ? 'text-green-500' : 'text-red-500'}>
								{trade.side}
							</TableCell>
							<TableCell>{formatNumber(trade.price, 6)}</TableCell>
							<TableCell>{formatNumber(trade.quantity, 4)}</TableCell>
							<TableCell>{formatNumber(trade.totalWithFee, 10)}</TableCell>
						</TableRow>
					))}
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
						<TabsTrigger value="history">History</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div className="h-full overflow-y-auto flex flex-col flex-grow">{renderContent()}</div>
		</div>
	)
}
