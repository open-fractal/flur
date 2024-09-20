'use client'

import { useState } from 'react'
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
		name: 'DragonDollar',
		symbol: 'DD',
		decimals: 2,
		limit: 5000,
		max: 5000000
	})
	const [error, setError] = useState('')

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

		if (parseInt(formData.decimals) < 0 || parseInt(formData.decimals) > 18) {
			setError('Decimals must be between 0 and 18')
			return
		}

		if (parseInt(formData.limitPerMint) <= 0 || parseInt(formData.maxTokenSupply) <= 0) {
			setError('Limit per mint and max token supply must be positive numbers')
			return
		}

		if (parseInt(formData.limitPerMint) > parseInt(formData.maxTokenSupply)) {
			setError('Limit per mint cannot be greater than max token supply')
			return
		}

		// Here you would typically call a function to deploy the token
		console.log('Deploying token:', formData)

		await handleDeploy(formData)
		// Reset form after successful submission
		setFormData({
			name: '',
			symbol: '',
			decimals: '',
			limitPerMint: '',
			maxTokenSupply: ''
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
							<Label htmlFor="decimals">Decimals</Label>
							<Input
								id="decimals"
								name="decimals"
								type="number"
								placeholder="18"
								value={formData.decimals}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="limitPerMint">Limit per mint</Label>
							<Input
								id="limitPerMint"
								name="limitPerMint"
								type="number"
								placeholder="1000"
								value={formData.limitPerMint}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="maxTokenSupply">Max token supply</Label>
							<Input
								id="maxTokenSupply"
								name="maxTokenSupply"
								type="number"
								placeholder="1000000"
								value={formData.maxTokenSupply}
								onChange={handleChange}
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start">
				<Button type="submit" onClick={handleSubmit}>
					Deploy Token
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
