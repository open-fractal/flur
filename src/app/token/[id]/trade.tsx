'use client'

import React, { useState } from 'react'
import { TokenData } from '@/hooks/use-token'
import { Orderbook } from './orderbook'
import { TradeHistory } from './trade-history'
import { PositionForm } from './position-form'
import { MyPositions } from './my-positions'
import { Chart } from './chart'
import useComponentSize from '@/hooks/use-componet-size'

// Update this type for the selected order
type SelectedOrder = {
	price: number
	amount: number
	isBuy: boolean
} | null

interface TradeProps {
	token: TokenData
	showMarket: boolean
}

const Trade: React.FC<TradeProps> = ({ token }) => {
	const { width: chartWidth, height: chartHeight, ref: chartRef } = useComponentSize()

	// Add state for the selected order
	const [selectedOrder, setSelectedOrder] = useState<SelectedOrder>(null)

	return (
		<div className="W-full h-full flex flex-grow">
			<div className="flex-grow flex flex-col">
				<div className="flex-grow flex items-center justify-center w-full" ref={chartRef}>
					<Chart token={token} height={chartHeight} width={chartWidth} />
				</div>
				<div className="h-[295px] border-t">
					<MyPositions token={token} />
				</div>
			</div>
			<div className="flex flex-col border-l w-[500px] max-h-[calc(100vh-179px)]">
				<div className="flex flex-grow overflow-hidden">
					<div className="max-w-md text-white border-l w-[250px] overflow-hidden">
						<Orderbook
							token={token}
							onOrderSelect={(price, amount, isBuy) => setSelectedOrder({ price, amount, isBuy })}
						/>
					</div>
					<div className="max-w-md text-white border-l w-[250px] overflow-hidden">
						<TradeHistory token={token} />
					</div>
				</div>
				<PositionForm token={token} selectedOrder={selectedOrder} />
			</div>
		</div>
	)
}

export default Trade
