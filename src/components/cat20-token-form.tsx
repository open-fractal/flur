'use client'

import { useState, useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDeploy } from '@/hooks/use-deploy'

export function Cat20TokenForm() {
	const { handleDeploy, isDeploying } = useDeploy()
	const [formData, setFormData] = useState({
		name: '',
		symbol: '',
		limit: '',
		max: ''
	})
	const [error, setError] = useState('')
	const [serviceFee, setServiceFee] = useState<string | null>(null)

	useEffect(() => {
		const fee = process.env.NEXT_PUBLIC_FEE_SATS
		if (fee) {
			// @ts-ignore
			setServiceFee(parseInt(fee) / 1e8)
		}
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		// Basic validation
		if (Object.values(formData).some(field => field === '')) {
			setError('All fields are required')
			return
		}

		if (parseInt(formData.limit) <= 0 || parseInt(formData.max) <= 0) {
			setError('Limit per mint and max token supply must be positive numbers')
			return
		}

		if (parseInt(formData.limit) > parseInt(formData.max)) {
			setError('Limit per mint cannot be greater than max token supply')
			return
		}

		console.log('Deploying token:', formData)

		await handleDeploy(formData)
		// Reset form after successful submission
		setFormData({
			name: '',
			symbol: '',
			limit: '',
			max: ''
		})
	}

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Deploy Cat20 Token</CardTitle>
				<CardDescription>Enter the details for your new Cat20 token.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								placeholder="My Cat Token"
								value={formData.name}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="symbol">Symbol</Label>
							<Input
								id="symbol"
								name="symbol"
								placeholder="CAT"
								value={formData.symbol}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="limit">Limit per mint</Label>
							<Input
								id="limit"
								name="limit"
								type="number"
								placeholder="1000"
								value={formData.limit}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="max">Max token supply</Label>
							<Input
								id="max"
								name="max"
								type="number"
								placeholder="1000000"
								value={formData.max}
								onChange={handleChange}
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start">
				{serviceFee && <p className="text-sm text-gray-500 mb-2">Service fee: {serviceFee} FB</p>}
				<Button className="w-full" type="submit" onClick={handleSubmit} disabled={isDeploying}>
					{isDeploying ? 'Deploying...' : 'Deploy Token'}
				</Button>
				{error && (
					<Alert variant="destructive" className="mt-4">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
			</CardFooter>
		</Card>
	)
}
