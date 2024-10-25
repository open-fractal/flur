'use client'

import React, { useEffect, FC, ReactElement, useRef, useMemo, useState } from 'react'
import { createChart, ColorType, CandlestickData } from 'lightweight-charts'
import { TokenData } from '@/hooks/use-token'
import { useTokenChart } from '@/hooks/use-token-chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Helper function to determine the appropriate precision
const getAppropriateDecimalPlaces = (price: number): number => {
	if (price >= 1) return 2
	if (price >= 0.1) return 3
	if (price >= 0.01) return 4
	if (price >= 0.001) return 5
	if (price >= 0.0001) return 6
	return 8
}

// Define the available timeframes
const timeframes = [
	{ value: '1h', label: '1H' },
	{ value: '4h', label: '4H' },
	{ value: '12h', label: '12H' },
	{ value: '1d', label: '1D' },
	{ value: '1w', label: '1W' }
]

export const Chart: FC<{
	width: number
	height: number
	token: TokenData
}> = (props): ReactElement => {
	const { width, height, token } = props
	const chartContainerRef = useRef<HTMLDivElement>(null)
	const [selectedTimeframe, setSelectedTimeframe] = useState('1h') // Changed default to '1h'
	const { chartData, isLoading, isError } = useTokenChart(token, selectedTimeframe)

	// Calculate the appropriate decimal places based on the latest price
	const decimalPlaces = useMemo(() => {
		if (chartData.length === 0) return 8
		const latestPrice = chartData[chartData.length - 1].close
		return getAppropriateDecimalPlaces(latestPrice)
	}, [chartData])

	useEffect(() => {
		if (
			isLoading ||
			isError ||
			!chartContainerRef.current ||
			!height ||
			typeof height !== 'number' ||
			height <= 0
		) {
			return
		}

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: 'black' },
				textColor: 'white'
			},
			grid: {
				vertLines: { visible: false },
				horzLines: { color: 'rgba(255, 255, 255, .2)' }
			},
			width: width,
			height: height,
			watermark: {
				visible: true,
				text: `${token.symbol}/FB`,
				color: 'rgba(255, 255, 255, 0.5)',
				fontSize: 24
			}
		})

		const candlestickSeries = chart.addCandlestickSeries({
			upColor: '#22c55e',
			downColor: '#ef4444',
			borderVisible: false,
			wickUpColor: '#22c55e',
			wickDownColor: '#ef4444',
			priceFormat: {
				type: 'price',
				precision: decimalPlaces,
				minMove: 1 / Math.pow(10, decimalPlaces)
			}
		})

		// Convert the API data to the format expected by lightweight-charts
		// @ts-ignore
		const formattedChartData: CandlestickData[] = chartData.map(candle => ({
			time: candle.time,
			open: candle.open,
			high: candle.high,
			low: candle.low,
			close: candle.close
		}))

		candlestickSeries.setData(formattedChartData)

		// Fit the time scale to show all data points
		chart.timeScale().fitContent()

		const handleResize = () => {
			if (chartContainerRef.current) {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth })
			}
			chart.timeScale().fitContent()
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			chart.remove()
		}
	}, [height, width, chartData, token.symbol, isLoading, isError, decimalPlaces, selectedTimeframe])

	// if (isLoading) {
	// 	return <div></div>
	// }

	if (isError) {
		return <div>Error loading chart data. Please try again later.</div>
	}

	return (
		<div className="relative" style={{ width, height }}>
			<div className="absolute top-2 left-2 z-10 bg-black">
				<Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
					<TabsList className="bg-black/60 backdrop-blur-sm">
						{timeframes.map(tf => (
							<TabsTrigger
								key={tf.value}
								value={tf.value}
								className="data-[state=active]:bg-white/10"
							>
								{tf.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>
			<div ref={chartContainerRef} className="w-full h-full" />
		</div>
	)
}
