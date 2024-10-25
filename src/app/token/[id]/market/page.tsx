import Component from './page.client'
import { fetchTokenDetails } from '../layout'

type Props = {
	params: { id: string }
}

export const revalidate = 120 // 2 minutes

export default async function Page({ params }: Props) {
	const token_id = params.id
	const tokenDetails = await fetchTokenDetails(token_id)
	return <Component token={tokenDetails} showMarket={true} />
}
