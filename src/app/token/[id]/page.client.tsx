'use client'

import React, { useEffect } from 'react'
import { useToken, TokenData } from '@/hooks/use-token'
import { useMinterUtxoCount } from '@/hooks/use-utxo-count'
import Trade from './trade'
import { useRouter } from 'next/navigation'

const TokenDetail: React.FC<{ token: TokenData; showMarket: boolean }> = ({
	token: initialToken,
	showMarket
}) => {
	const router = useRouter()

	const { token, isLoading: isTokenLoading } = useToken(initialToken.tokenId)
	const { utxoCount, isLoading: isUtxoCountLoading } = useMinterUtxoCount(initialToken.tokenId)

	const isLoading = isTokenLoading || isUtxoCountLoading
	const isMintable = !!utxoCount && utxoCount > 0
	const tokenData = token || initialToken

	useEffect(() => {
		if (!isLoading && isMintable) {
			router.replace(`/token/${tokenData.tokenId}/mint`)
		}
	}, [isLoading, isMintable, router])

	if (isMintable) {
		return <></>
	}

	return (
		<>
			<Trade token={tokenData} showMarket={showMarket} />
		</>
	)
}

export default TokenDetail
