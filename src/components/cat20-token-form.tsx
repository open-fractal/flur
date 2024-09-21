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
import { AlertCircle, Wand2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDeploy } from '@/hooks/use-deploy'
import { experimental_useObject as useObject } from 'ai/react'
import { z } from 'zod'
import { tokenListSchema } from '@/app/api/use-object/schema'

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
	const [generatedTokens, setGeneratedTokens] = useState<z.infer<typeof tokenListSchema>[]>([])

	const [isAIEnabled, setIsAIEnabled] = useState(false)

	useEffect(() => {
		setIsAIEnabled(process.env.NEXT_PUBLIC_ENABLE_AI === 'true')
	}, [])

	const { submit: generateAIData, isLoading: isGeneratingAI } = useObject({
		api: '/api/use-object',
		schema: tokenListSchema,
		onError: error => {
			console.error('AI generation error:', error)
			setError('Failed to generate AI data. Please try again.')
		},
		onFinish: response => {
			console.log('Generated tokens:', response)
			if (response && response.object && Array.isArray(response.object.object)) {
				// @ts-ignore
				setGeneratedTokens(response.object.object)
				if (response.object.object.length > 0) {
					const randomToken =
						response.object.object[Math.floor(Math.random() * response.object.object.length)]
					setFormData({
						name: randomToken.name,
						symbol: randomToken.symbol,
						limit: randomToken.limit.toString(),
						max: randomToken.max.toString()
					})
				}
			} else {
				console.error('Unexpected tokens format:', response)
				setError('Received unexpected data format from AI generation.')
			}
		}
	})

	useEffect(() => {
		const fee = process.env.NEXT_PUBLIC_FEE_SATS
		if (fee) {
			setServiceFee((parseInt(fee) / 1e8).toString())
		}
	}, [])

	const handleAIGenerate = () => {
		generateAIData(formData.name.trim())
	}

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

		const limit = parseInt(formData.limit)
		const max = parseInt(formData.max)

		if (limit <= 0 || max <= 0) {
			setError('Limit per mint and max token supply must be positive numbers')
			return
		}

		if (limit > max) {
			setError('Limit per mint cannot be greater than max token supply')
			return
		}

		if (max % limit !== 0) {
			setError('Max token supply must be equally divisible by limit per mint')
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
		<Card className="w-[350px] relative">
			<CardHeader>
				<CardTitle>Deploy Cat20 Token</CardTitle>
				<CardDescription>Enter the details for your new Cat20 token.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<div className="relative">
								<Input
									id="name"
									name="name"
									placeholder="My Cat Token"
									value={formData.name}
									onChange={handleChange}
								/>
								{isAIEnabled && (
									<Button
										size="icon"
										variant="ghost"
										className="absolute right-0 top-0 h-full"
										onClick={handleAIGenerate}
										disabled={isGeneratingAI || !formData.name}
									>
										<Wand2 className="h-4 w-4" />
									</Button>
								)}
							</div>
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
					{generatedTokens.length > 0 && (
						<div className="mt-4">
							<Label>Generated Tokens</Label>
							<ul className="text-sm mt-2">
								{generatedTokens.map((token, index) => (
									<li key={index} className="mb-2">
										<Button
											variant="outline"
											size="sm"
											onClick={e => {
												e.preventDefault()
												e.stopPropagation()
												setFormData({
													// @ts-ignore
													name: token.name,
													// @ts-ignore
													symbol: token.symbol,
													// @ts-ignore
													limit: token.limit.toString(),
													// @ts-ignore
													max: token.max.toString()
												})
											}}
										>
											{/* @ts-ignore */}
											{token.name} ({token.symbol})
										</Button>
									</li>
								))}
							</ul>
						</div>
					)}
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start">
				{serviceFee && <p className="text-sm text-gray-500 mb-2">Service fee: {serviceFee} FB</p>}
				<Button className="w-full" type="submit" onClick={handleSubmit} disabled={isDeploying}>
					{isDeploying ? 'Deploying...' : 'Deploy Token'}
				</Button>
				<p className="text-xs text-gray-500 mt-2">You will sign two transactions to deploy</p>
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
