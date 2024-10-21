export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const EXPLORER_URL =
	process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://fractal.unisat.io/explorer'
export const MEMPOOL_URL =
	process.env.NEXT_PUBLIC_MEMPOOL_URL || 'https://mempool.fractalbitcoin.io/api/v1'
export const FXP_SERVICE_FEE = 1000000n
export const FXP_SERVICE_FEE_P2TR =
	'512067fe8e4767ab1a9056b1e7c6166d690e641d3f40e188241f35f803b1f84546c2'
export const FXP_TOKEN_ID = 'b59a5be98ffd7ec71e4a4e8dec7cb3f9043c65a05d78b79dcda1208a79d291d6_0'
export enum ContractType {
	FXPCAT20_SELL = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPCat20Sell.json').md5,
	FXPCAT20_BUY = require('@/lib/scrypt/contracts/artifacts/contracts/token/FXPCat20Buy.json').md5,
	CAT20_SELL = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20Sell.json').md5,
	CAT20_BUY = require('@/lib/scrypt/contracts/artifacts/contracts/token/buyCAT20.json').md5
}
