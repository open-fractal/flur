'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useToken, TokenData } from '@/hooks/use-token'
import { useMinterUtxoCount } from '@/hooks/use-utxo-count'
import Mint from '../mint'

const TokenDetail: React.FC<{ token: TokenData }> = ({ token: initialToken }) => {
	const [error, setError] = useState<string | null>(null)

	const { token, isLoading: isTokenLoading, isError: tokenError } = useToken(initialToken.tokenId)
	const { utxoCount, isLoading: isUtxoCountLoading, isError: utxoCountError } = useMinterUtxoCount(
		initialToken.tokenId
	)

	const tokenData = token || initialToken

	useEffect(() => {
		if (tokenError || utxoCountError) {
			setError('Failed to load token details. Please try again later.')
			console.error('Error fetching data:', tokenError || utxoCountError)
		} else {
			setError(null)
		}
	}, [tokenError, utxoCountError])

	if (error) {
		return <ErrorDisplay message={error} />
	}

	const isLoading = isTokenLoading || isUtxoCountLoading

	return (
		<>
			{isLoading && (
				<div className="container mx-auto p-4 space-y-6 h-full flex-grow flex flex-col items-center justify-center">
					<div className="flex flex-col justify-center items-center">
						<Card className="w-[400px] max-w-[100vw]">
							<CardContent className="p-6 space-y-4">
								<Skeleton className="h-8 w-3/4 mx-auto" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-10 w-full" />
							</CardContent>
						</Card>
					</div>
				</div>
			)}
			<div className="container mx-auto p-4 space-y-6 h-full flex-grow flex flex-col items-center justify-center">
				<div className="flex flex-col justify-center items-center">
					<Mint token={tokenData} utxoCount={utxoCount} isUtxoCountLoading={isUtxoCountLoading} />
				</div>
			</div>
		</>
	)
}

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
	<div className="container mx-auto p-4">
		<Card>
			<CardContent className="p-6">
				<p className="text-red-500">{message}</p>
				<Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
					Return to Token List
				</Link>
			</CardContent>
		</Card>
	</div>
)

export default TokenDetail
