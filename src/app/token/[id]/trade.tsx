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
	showMarket: boolean
}

const Trade: React.FC<TradeProps> = ({ token, showMarket }) => {
	const { width, height, ref } = useComponentSize()

	return (
		<div className="W-full h-full flex flex-grow">
			<div className="flex-grow flex flex-col items-center justify-center">
				<div className="flex flex-col justify-center items-center">
					<h2 className="text-2xl font-bold mb-4">Mint Ended</h2>
					<p className="text-muted-foreground">Check back later!</p>
				</div>
			</div>
		</div>
	)
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
