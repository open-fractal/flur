'use client'

import React from 'react'
import { useToken, TokenData } from '@/hooks/use-token'

import Trade from '../trade'

const TokenDetail: React.FC<{ token: TokenData; showMarket: boolean }> = ({
	token: initialToken,
	showMarket
}) => {
	const { token } = useToken(initialToken.tokenId)
	const tokenData = token || initialToken
	return <Trade token={tokenData} showMarket={showMarket} />
}

export default TokenDetail
