import { unstable_flag as flag } from '@vercel/flags/next'

export const showMarket = flag({
	key: 'market',
	decide: () => false
})
