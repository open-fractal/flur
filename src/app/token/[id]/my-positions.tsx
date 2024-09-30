'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { TokenData } from '@/hooks/use-token'

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

const { orderHistoryData, tradeHistoryData } = generateDefaultData()

export function MyPositions(props: { token: TokenData }) {
	const { token } = props
	console.log(token)
	return (
		<Tabs defaultValue="open-orders" className="w-full h-full flex flex-col">
			<div className="px-4 pt-4">
				<TabsList>
					<TabsTrigger value="open-orders">Open Orders(0)</TabsTrigger>
					<TabsTrigger value="order-history">Order History</TabsTrigger>
					<TabsTrigger value="trade-history">Trade History</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="open-orders">
				<p>No open orders</p>
			</TabsContent>
			<TabsContent value="order-history" className="h-full overflow-y-auto flex flex-col flex-grow">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Created Time</TableHead>
							<TableHead>Last Update</TableHead>
							<TableHead>Side</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Filled Quantity</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orderHistoryData.map((order, index) => (
							<TableRow key={index}>
								<TableCell>{order.createdTime}</TableCell>
								<TableCell>{order.lastUpdate}</TableCell>
								<TableCell className={order.side === 'BUY' ? 'text-green-500' : 'text-red-500'}>
									{order.side}
								</TableCell>
								<TableCell>{order.price.toFixed(6)}</TableCell>
								<TableCell>{order.filledQuantity.toFixed(8)}</TableCell>
								<TableCell>{order.status}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TabsContent>
			<TabsContent value="trade-history">
				<Table>
					<TableHeader>
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
								<TableCell>{trade.price.toFixed(6)}</TableCell>
								<TableCell>{trade.quantity.toFixed(4)}</TableCell>
								<TableCell>{trade.totalWithFee.toFixed(10)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TabsContent>
		</Tabs>
	)
}
