'use client'

import React from 'react'
import { UnisatAPI } from '@/lib/unisat'
import { TokenDataTable } from '@/components/token-data-table'

declare global {
	interface Window {
		unisat: UnisatAPI
	}
}

export default function Home() {
	return <TokenDataTable />
}
