'use client'

import React from 'react'
import { useToken, TokenData } from '@/hooks/use-token'
import { TransferToken } from '../transfer-token'
import { Card, CardContent } from '@/components/ui/card'

const TokenDetail: React.FC<{ token: TokenData }> = ({ token: initialToken }) => {
	const { token } = useToken(initialToken.tokenId)
	const tokenData = token || initialToken
	return (
		<div className="container mx-auto p-4 space-y-6 h-full flex-grow flex flex-col items-center justify-center">
			<div className="flex flex-col justify-center items-center">
				<Card className="w-[400px] max-w-[100vw]">
					<CardContent className="p-0 space-y-4">
						<TransferToken token={tokenData} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default TokenDetail
