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
import { TokenData } from '@/types/token'
type Trade = {
	price: number
	amount: number
	time: string
}

type TradeHistoryProps = {
	trades?: Trade[]
	token: TokenData
}

// Function to generate a dataset of trades
function generateTradeset(basePrice: number, count: number): Trade[] {
	const trades: Trade[] = []
	let currentPrice = basePrice
	let currentTime = new Date()

	for (let i = 0; i < count; i++) {
		// Generate a random price change (-0.5% to +0.5%)
		const priceChange = currentPrice * (Math.random() * 0.01 - 0.005)
		currentPrice += priceChange

		// Generate a random amount (0.00001 to 1 BTC)
		const amount = Math.random() * 0.99999 + 0.00001

		// Generate a time string (HH:mm:ss)
		const timeString = currentTime.toTimeString().split(' ')[0]

		trades.push({
			price: parseFloat(currentPrice.toFixed(2)),
			amount: parseFloat(amount.toFixed(5)),
			time: timeString
		})

		// Decrease time by a random amount (1 to 10 seconds)
		currentTime.setSeconds(currentTime.getSeconds() - Math.floor(Math.random() * 10 + 1))
	}

	return trades.reverse() // Reverse to get most recent trades first
}

// Generate about 200 trades
const defaultTrades: Trade[] = generateTradeset(65000, 200)

export function TradeHistory({ trades = defaultTrades, token }: TradeHistoryProps) {
	const formatNumber = (num: number) => {
		return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })
	}

	const getTradeColor = (index: number) => {
		if (index === trades.length - 1) return 'text-white'
		return trades[index].price > trades[index + 1].price ? 'text-green-500' : 'text-red-500'
	}

	// Define column widths
	const columnWidths = {
		price: '40%',
		amount: '35%',
		time: '25%'
	}

	return (
		<div className="max-w-md bg-black text-white border-l w-[250px] max-h-[509px] overflow-y-auto">
			<div>
				<h3 className="px-4 py-2 text-sm font-semibold">Trade History</h3>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b">
							<TableHead
								className="text-left text-[10px] text-gray-400 font-normal h-6 sticky top-0 bg-black"
								style={{ width: columnWidths.price }}
							>
								Price(FB)
							</TableHead>
							<TableHead
								className="text-right text-[10px] text-gray-400 font-normal h-6 sticky top-0 bg-black"
								style={{ width: columnWidths.amount }}
							>
								Amount({token.symbol})
							</TableHead>
							<TableHead
								className="text-right text-[10px] text-gray-400 font-normal h-6 sticky top-0 bg-black"
								style={{ width: columnWidths.time }}
							>
								Time
							</TableHead>
						</TableRow>
					</TableHeader>
				</Table>
			</div>
			<div className="p-0 max-h-[600px] overflow-y-auto">
				<Table>
					<TableBody>
						{trades.map((trade, index) => (
							<TableRow key={index} className="hover:bg-transparent">
								<TableCell
									className={`text-left text-[11px] py-0 ${getTradeColor(index)}`}
									style={{ width: columnWidths.price }}
								>
									{formatNumber(trade.price)}
								</TableCell>
								<TableCell
									className="text-right text-[11px] text-gray-300 py-0"
									style={{ width: columnWidths.amount }}
								>
									{formatNumber(trade.amount)}
								</TableCell>
								<TableCell
									className="text-right text-[11px] text-gray-300 py-0"
									style={{ width: columnWidths.time }}
								>
									{trade.time}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
