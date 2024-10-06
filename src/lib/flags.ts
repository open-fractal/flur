import { unstable_flag as flag } from '@vercel/flags/next'

export const showMarket = flag({
	key: 'market',
	decide: () => (process.env.ENABLE_MARKET ? true : false)
})
