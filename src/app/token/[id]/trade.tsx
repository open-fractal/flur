'use client'

import React from 'react'
import { TokenData } from '@/hooks/use-token'

import { Orderbook } from './orderbook'
import { TradeHistory } from './trade-history'
import { PositionForm } from './position-form'
import { MyPositions } from './my-positions'
import { Chart } from './chart'

import useComponentSize from '@/hooks/use-componet-size'

interface TradeProps {
	token: TokenData
}

const Trade: React.FC<TradeProps> = ({ token }) => {
	const { width, height, ref } = useComponentSize()

	console.log(width, height)

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
			<div className="flex flex-col border-l">
				<div className="flex flex-grow">
					<Orderbook token={token} />
					<TradeHistory token={token} />
				</div>
				<PositionForm token={token} />
			</div>
		</div>
	)
}

export default Trade
