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

const Trade: React.FC<TradeProps> = ({ token, showMarket }) => {
	const { width, height, ref } = useComponentSize()
	// Add state for the selected order
	const [selectedOrder, setSelectedOrder] = useState<SelectedOrder>(null)

	return (
		<div className="W-full h-full flex flex-grow">
			<div className="flex-grow flex flex-col">
				<div className="flex-grow flex items-center justify-center w-full" ref={ref}>
					<Chart token={token} height={height} width={width} />
				</div>
				<div className="h-[295px] border-t">
					<MyPositions token={token} />
				</div>
			</div>
			<div className="flex flex-col border-l w-[500px]">
				<div className="flex flex-grow">
					<Orderbook
						token={token}
						onOrderSelect={(price, amount, isBuy) => setSelectedOrder({ price, amount, isBuy })}
					/>
					<TradeHistory token={token} />
				</div>
				<PositionForm token={token} selectedOrder={selectedOrder} />
			</div>
		</div>
	)
}

export default Trade
