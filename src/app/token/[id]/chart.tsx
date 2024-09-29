'use client'

import React, { useEffect, FC, ReactElement, useRef, useState } from 'react'
import { createChart, ColorType, ISeriesApi, CandlestickData } from 'lightweight-charts'
import { TokenData } from '@/hooks/use-token'

// Function to generate mock candlestick data
function generateMockData(days: number): CandlestickData[] {
	const data: CandlestickData[] = []
	const today = new Date()
	let price = 100 // Starting price

	for (let i = days; i > 0; i--) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)

		const open = price + (Math.random() - 0.5) * 10
		const close = open + (Math.random() - 0.5) * 5
		const high = Math.max(open, close) + Math.random() * 5
		const low = Math.min(open, close) - Math.random() * 5

		data.push({
			time: date.toISOString().split('T')[0], // Format: 'YYYY-MM-DD'
			open,
			high,
			low,
			close
		})

		price = close // Set the next day's starting price
	}

	return data
}

export const Chart: FC<{
	width: number
	height: number
	token: TokenData
}> = (props): ReactElement => {
	const { width, height, token } = props
	const [chartData, setChartData] = useState<CandlestickData[]>([])
	const chartContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Generate 90 days of mock data
		const mockData = generateMockData(90)
		setChartData(mockData)
	}, [])

	useEffect(() => {
		if (!chartContainerRef.current || !height || typeof height !== 'number' || height <= 0) {
			console.error('Invalid chart container or dimensions')
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
				text: `${token.symbol}/FB (Mock Data)`,
				color: 'rgba(255, 255, 255, 0.5)',
				fontSize: 24
			}
		})

		const candlestickSeries = chart.addCandlestickSeries({
			upColor: '#22c55e',
			downColor: '#ef4444',
			borderVisible: false,
			wickUpColor: '#22c55e',
			wickDownColor: '#ef4444'
		})

		candlestickSeries.setData(chartData)

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
	}, [height, width, chartData, token.symbol])

	return <div ref={chartContainerRef} />
}
