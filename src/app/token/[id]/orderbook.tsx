'use client'

import React from 'react'
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
	price: number
	amount: number
	total: number
}

type OrderbookProps = {
	buyOrders?: Order[]
	sellOrders?: Order[]
	currentPrice?: number
	token: TokenData
}

const defaultBuyOrders: Order[] = [
	{ price: 2.0197, amount: 437.501, total: 883.59 },
	{ price: 2.0196, amount: 14.04, total: 28.35 },
	{ price: 2.0195, amount: 237.0, total: 478.62 },
	{ price: 2.0194, amount: 399.54, total: 806.84 },
	{ price: 2.0193, amount: 110.0, total: 222.12 },
	{ price: 2.0192, amount: 301.81, total: 609.42 },
	{ price: 2.0191, amount: 2000.0, total: 4038.2 },
	{ price: 2.019, amount: 37.0, total: 74.7 },
	{ price: 2.0189, amount: 744.0, total: 1502.06 }
]

const defaultSellOrders: Order[] = [
	{ price: 2.0207, amount: 128.0, total: 258.65 },
	{ price: 2.0206, amount: 1026.0, total: 2073.14 },
	{ price: 2.0205, amount: 12.0, total: 24.25 },
	{ price: 2.0204, amount: 496.0, total: 1002.12 },
	{ price: 2.0203, amount: 328.3, total: 663.27 },
	{ price: 2.0202, amount: 616.5, total: 1245.45 },
	{ price: 2.0201, amount: 31.0, total: 62.62 },
	{ price: 2.02, amount: 10.0, total: 20.2 },
	{ price: 2.0199, amount: 10.0, total: 20.2 }
]

const defaultCurrentPrice = 2.0198

export function Orderbook({
	buyOrders = defaultBuyOrders,
	sellOrders = defaultSellOrders,
	currentPrice = defaultCurrentPrice,
	token
}: OrderbookProps) {
	const formatNumber = (num: number) => {
		return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })
	}

	const formatTotal = (num: number) => {
		if (num >= 1000) {
			return (num / 1000).toFixed(2) + 'K'
		}
		return num.toFixed(2)
	}

	const getMaxTotal = (orders: Order[]) => {
		return Math.max(...orders.map(order => order.total))
	}

	const maxSellTotal = getMaxTotal(sellOrders)
	const maxBuyTotal = getMaxTotal(buyOrders)

	return (
		<div className="h-full max-w-md bg-black text-white w-[250px]">
			<div className="px-4 py-2">
				<div className="text-sm font-semibold flex justify-between items-center">
					<span>Order Book</span>
					<span className="text-xs text-gray-400">0.0001</span>
				</div>
			</div>
			<div className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b">
							<TableHead className="text-left text-[10px] text-gray-400 font-normal h-6">
								Price(FB)
							</TableHead>
							<TableHead className="text-right text-[10px] text-gray-400 font-normal h-6">
								Amount({token.symbol})
							</TableHead>
							<TableHead className="text-right text-[10px] text-gray-400 font-normal h-6">
								Total
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sellOrders.map((order, index) => (
							<TableRow key={`sell-${index}`} className="hover:bg-transparent relative">
								<TableCell className="text-left text-[11px] text-red-500 py-0 z-10">
									{formatNumber(order.price)}
								</TableCell>
								<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
									{formatNumber(order.amount)}
								</TableCell>
								<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
									{formatTotal(order.total)}
								</TableCell>
								<div
									className="absolute inset-0 bg-red-500"
									style={{
										width: `${(order.total / maxSellTotal) * 100}%`,
										right: 0,
										opacity: 0.3
									}}
								/>
							</TableRow>
						))}
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={3} className="text-center py-1 border-y">
								<p className="text-xl font-bold flex items-center gap-2 justify-center">
									{formatNumber(currentPrice)}
									<span className="text-xs font-normal text-gray-400">
										${formatNumber(currentPrice)}
									</span>
								</p>
							</TableCell>
						</TableRow>
						{buyOrders.map((order, index) => (
							<TableRow key={`buy-${index}`} className="hover:bg-transparent relative">
								<TableCell className="text-left text-[11px] text-green-500 py-0 z-10">
									{formatNumber(order.price)}
								</TableCell>
								<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
									{formatNumber(order.amount)}
								</TableCell>
								<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
									{formatTotal(order.total)}
								</TableCell>
								<div
									className="absolute inset-0 bg-green-500"
									style={{
										width: `${(order.total / maxBuyTotal) * 100}%`,
										left: 0,
										opacity: 0.3
										// opacity: 0.1 + (order.total / maxBuyTotal) * 0.2
									}}
								/>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="flex justify-between items-center px-4 py-2 text-[11px] border-t">
					<span className="text-green-500">B 65.40%</span>
					<div className="w-1/2 h-1 bg-gray-700 rounded-full overflow-hidden">
						<div className="h-full bg-green-500" style={{ width: '65.40%' }}></div>
					</div>
					<span className="text-red-500">34.60% S</span>
				</div>
			</div>
		</div>
	)
}
