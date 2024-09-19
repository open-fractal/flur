import React from 'react'
// import useSWR from 'swr'
// import { API_URL } from '@/lib/constants'

interface MintFeeProps {
	className?: string
}

// const fetcher = (url: string) => fetch(url).then(res => res.json())

export const MintFee: React.FC<MintFeeProps> = ({ className }) => {
	// const { data: mintFeeData, error } = useSWR(`${API_URL}/api/mint-fee`, fetcher)
	// if (!mintFeeData) return <div className={`${className} text-gray-500`}>Loading...</div>
	// if (error) return <div className={`${className} text-gray-500`}>Error fetching mint fee</div>

	return <div className={`${className} text-gray-400`}>Service Fee: 0 Sats</div>
}
