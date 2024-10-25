import { Metadata } from 'next'
import { API_URL } from '@/lib/constants'
import { validateTokenId } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { TokenHeader } from '@/components/token-header'

type Props = {
	params: { id: string }
	searchParams: { [key: string]: string | string[] | undefined }
	children: React.ReactNode
}

export const revalidate = 120 // 2 minutes

// Function to fetch token details
// @ts-ignore
export async function fetchTokenDetails(token_id: string) {
	try {
		const url = `${API_URL}/api/tokens/${token_id}`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Failed to fetch token details')
		}
		return (await response.json()).data
	} catch (error) {
		console.error('Error fetching token details:', error)
		return null
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// Validate token_id
	const token_id = params.id
	if (!token_id || !validateTokenId(token_id)) {
		return {}
	}

	// Fetch token details
	const tokenDetails = await fetchTokenDetails(token_id)

	// If token details couldn't be fetched, return default metadata
	if (!tokenDetails) {
		return {}
	}

	// Generate metadata based on token details
	return {
		title: `${tokenDetails.symbol} ${token_id} | Flur.gg`,
		description: `View ${tokenDetails.symbol} token details on Flur.gg.`,
		openGraph: {
			title: `${tokenDetails.symbol} ${token_id} | Flur.gg`,
			description: `View ${tokenDetails.symbol} token details on Flur.gg.`,
			images: ['https://flur.gg/unfurl.jpeg']
		}
	}
}

export default async function Layout({ params, children }: Props) {
	const token_id = params.id
	if (!token_id || !validateTokenId(token_id)) {
		return <div>Invalid token ID</div>
	}

	// Fetch token details
	const tokenDetails = await fetchTokenDetails(token_id)

	// If token details couldn't be fetched, show skeleton
	// If token details couldn't be fetched, show skeleton
	if (!tokenDetails) {
		return (
			<div className="flex justify-center container p-8">
				<div className="flex flex-col gap-4 items-center justify-center w-full max-w-md">
					<Skeleton className="h-8 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-10 w-1/2 mt-4" />
				</div>
			</div>
		)
	}

	return (
		<>
			<TokenHeader tokenData={tokenDetails} />
			{children}
		</>
	)
}
