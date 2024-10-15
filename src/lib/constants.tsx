export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const EXPLORER_URL =
	process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://fractal.unisat.io/explorer'
export const MEMPOOL_URL =
	process.env.NEXT_PUBLIC_MEMPOOL_URL || 'https://mempool.fractalbitcoin.io/api/v1'
export const FXP_SERVICE_FEE = 1000000n
export const FXP_SERVICE_FEE_P2TR =
	'512067fe8e4767ab1a9056b1e7c6166d690e641d3f40e188241f35f803b1f84546c2'
export enum ContractType {
	FXPCAT20_SELL = '96a55b127f2bd36bb606b2652c136534',
	FXPCAT20_BUY = '5453660eb0df468a6c2190a5cd7bc167',
	CAT20_SELL = '1fc0e92f9c8b9c80bd3a981f87baa7b1',
	CAT20_BUY = 'fd87e8ee5f4c3eb411dc059022e92e79'
}
