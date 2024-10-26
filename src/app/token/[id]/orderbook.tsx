'use client'

import React, { useMemo, useEffect, useRef } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { TokenData } from '@/hooks/use-token'
import { useTokenOrderbook } from '@/hooks/use-token-orderbook'

type Order = {
	price: number
	amount: number
	total: number
	originalAmount: number
}

type GroupedOrder = {
	price: number
	amount: number
	total: number
	largestSingleAmount: number
	originalOrders: Order[]
}

type OrderbookProps = {
	token: TokenData
	onOrderSelect: (price: number, amount: number, isBuy: boolean) => void
}

export function Orderbook({ token, onOrderSelect }: OrderbookProps) {
	const {
		sellOrders: rawSellOrders = [],
		buyOrders: rawBuyOrders = [],
		bestSellPrice,
		bestBuyPrice,
		isError
	} = useTokenOrderbook(token)

	const formatNumber = (num: number) => {
		return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })
	}

	const formatCompactNumber = (num: number) => {
		const absNum = Math.abs(num)
		if (absNum >= 1e9) {
			return (num / 1e9).toFixed(2) + 'B'
		} else if (absNum >= 1e6) {
			return (num / 1e6).toFixed(2) + 'M'
		} else if (absNum >= 1e3) {
			return (num / 1e3).toFixed(2) + 'K'
		} else if (absNum < 0.01) {
			// Show up to 8 decimal places for very small numbers
			return absNum.toFixed(8).replace(/\.?0+$/, '')
		}
		return num.toFixed(2)
	}

	const processOrders = (orders: any[]): Order[] => {
		return orders.map(order => {
			const price = (parseFloat(order.price) * Math.pow(10, token.decimals)) / 1e8
			const amount = parseInt(order.tokenAmount) / Math.pow(10, token.decimals)

			// Add originalAmount to track individual order amounts
			return {
				price,
				amount,
				total: amount,
				originalAmount: amount // Store the original ungrouped amount
			}
		})
	}

	const groupAndSortOrders = (orders: Order[], isSellOrder: boolean): GroupedOrder[] => {
		const groupedOrders = orders.reduce((acc, order) => {
			const key = order.price.toFixed(8)
			if (!acc[key]) {
				acc[key] = {
					...order,
					// Store the largest individual order amount
					largestSingleAmount: order.originalAmount,
					originalOrders: [order]
				}
			} else {
				acc[key].amount += order.amount
				// Update largest single order amount if current order is larger
				acc[key].largestSingleAmount = Math.max(acc[key].largestSingleAmount, order.originalAmount)
				acc[key].originalOrders.push(order)
			}
			return acc
		}, {} as Record<string, GroupedOrder & { largestSingleAmount: number; originalOrders: Order[] }>)

		const sortedOrders = Object.values(groupedOrders).sort((a, b) =>
			isSellOrder ? b.price - a.price : a.price - b.price
		)

		let cumulativeTotal = 0
		return (isSellOrder ? sortedOrders.reverse() : sortedOrders)
			.map(order => {
				cumulativeTotal += order.amount
				return {
					...order,
					total: cumulativeTotal
				}
			})
			.reverse()
	}

	const sellOrders = useMemo(() => groupAndSortOrders(processOrders(rawSellOrders), true), [
		rawSellOrders,
		token.decimals
	])
	const buyOrders = useMemo(() => groupAndSortOrders(processOrders(rawBuyOrders), false), [
		rawBuyOrders,
		token.decimals
	])

	// Calculate total buy and sell amounts
	const totalBuyAmount = useMemo(() => buyOrders.reduce((sum, order) => sum + order.amount, 0), [
		buyOrders
	])
	const totalSellAmount = useMemo(() => sellOrders.reduce((sum, order) => sum + order.amount, 0), [
		sellOrders
	])

	// Calculate the buy percentage
	const buyPercentage = useMemo(() => {
		const total = totalBuyAmount + totalSellAmount
		return total > 0 ? (totalBuyAmount / total) * 100 : 0
	}, [totalBuyAmount, totalSellAmount])

	const getMaxAmount = (orders: GroupedOrder[]) => {
		return Math.max(...orders.map(order => order.amount))
	}

	const maxSellAmount = getMaxAmount(sellOrders)
	const maxBuyAmount = getMaxAmount(buyOrders)

	const currentPrice = ((bestSellPrice || bestBuyPrice || 0) * Math.pow(10, token.decimals)) / 1e8

	useEffect(() => {
		if (sellOrdersRef.current) {
			sellOrdersRef.current.scrollTop = sellOrdersRef.current.scrollHeight
		}
	}, [sellOrders]) // Re-run when sell orders change
	const sellOrdersRef = useRef<HTMLDivElement>(null)

	if (isError) {
		return <div className="h-full flex items-center justify-center">Error loading orderbook</div>
	}

	const handleOrderClick = (order: GroupedOrder, isBuy: boolean) => {
		// Use the largest single order amount instead of the grouped amount
		onOrderSelect(order.price, order.largestSingleAmount, isBuy)
	}

	return (
		<div className="h-full w-full flex flex-col bg-black text-white">
			<div className="px-4 py-2">
				<div className="text-sm font-semibold flex justify-between items-center">
					<span>Order Book</span>
				</div>
			</div>

			{/* Main content container */}
			<div className="flex-1 flex flex-col min-h-0">
				{' '}
				{/* min-h-0 is crucial for nested flex containers */}
				{/* Header */}
				<Table>
					<TableHeader className="sticky top-0 bg-black z-10">
						<TableRow className="hover:bg-transparent border-b">
							<TableHead className="text-left text-[10px] text-gray-400 font-normal h-6">
								Price(FB)
							</TableHead>
							<TableHead className="text-right text-[10px] text-gray-400 font-normal h-6">
								Amount({token.symbol})
							</TableHead>
							<TableHead className="text-right text-[10px] text-gray-400 font-normal h-6">
								Total ({token.symbol})
							</TableHead>
						</TableRow>
					</TableHeader>
				</Table>
				{/* Sell orders */}
				<div ref={sellOrdersRef} className="flex-1 overflow-auto">
					<Table>
						<TableBody>
							{sellOrders.map((order, index) => (
								<TableRow
									key={`sell-${index}`}
									className="hover:bg-transparent relative cursor-pointer"
									onClick={() => handleOrderClick(order, false)}
								>
									<TableCell className="text-left text-[11px] text-red-500 py-0 z-10">
										{formatCompactNumber(order.price)}
									</TableCell>
									<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
										{formatNumber(order.amount)}
									</TableCell>
									<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
										{formatNumber(order.total)}
									</TableCell>
									<div
										className="absolute inset-0 bg-red-500"
										style={{
											width: `${(order.amount / maxSellAmount) * 100}%`,
											right: 0,
											opacity: 0.3
										}}
									/>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{/* Current price section */}
				<div className="py-1 border-t border-b">
					<p className="text-l font-bold flex items-center gap-2 justify-center">
						{formatCompactNumber(currentPrice)} FB
					</p>
				</div>
				{/* Buy orders */}
				<div className="flex-1 overflow-auto">
					<Table>
						<TableBody>
							{buyOrders.map((order, index) => (
								<TableRow
									key={`buy-${index}`}
									className="hover:bg-transparent relative cursor-pointer"
									onClick={() => handleOrderClick(order, true)}
								>
									<TableCell className="text-left text-[11px] text-green-500 py-0 z-10">
										{formatCompactNumber(order.price)}
									</TableCell>
									<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
										{formatNumber(order.amount)}
									</TableCell>
									<TableCell className="text-right text-[11px] text-gray-300 py-0 z-10">
										{formatNumber(order.total)}
									</TableCell>
									<div
										className="absolute inset-0 bg-green-500"
										style={{
											width: `${(order.amount / maxBuyAmount) * 100}%`,
											left: 0,
											opacity: 0.3
										}}
									/>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{/* Buy/Sell percentage indicator */}
				<div className="flex justify-between items-center px-4 py-2 text-[11px] border-t">
					<span className="text-green-500">B {buyPercentage.toFixed(2)}%</span>
					<div className="w-1/2 h-1 bg-gray-700 rounded-full overflow-hidden">
						<div className="h-full bg-green-500" style={{ width: `${buyPercentage}%` }}></div>
					</div>
					<span className="text-red-500">{(100 - buyPercentage).toFixed(2)}% S</span>
				</div>
			</div>
		</div>
	)
}
