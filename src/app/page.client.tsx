'use client'

import React from 'react'
import { useWallet } from '@/lib/unisat'
import { TokenBalances } from '@/components/token-balances'
import { UnisatAPI } from '@/lib/unisat'
import { TokenDataTable } from '@/components/token-data-table'

declare global {
	interface Window {
		unisat: UnisatAPI
	}
}

export default function Home() {
	const { address } = useWallet()

	return (
		<div className="container mx-auto p">
			<div className="space-y-4">
				{address && <TokenBalances />}
				<TokenDataTable />
			</div>
		</div>
	)
}
