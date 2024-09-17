import {
	OpenMinterTokenInfo,
	TokenMetadata,
	TokenInfo,
	scaleByDecimals,
	getTokenMetadata
} from '@/lib/scrypt/common'

export function scaleConfig(config: OpenMinterTokenInfo): OpenMinterTokenInfo {
	const clone = Object.assign({}, config)

	clone.max = scaleByDecimals(config.max, config.decimals)
	clone.premine = scaleByDecimals(config.premine, config.decimals)
	clone.limit = scaleByDecimals(config.limit, config.decimals)

	return clone
}

export async function findTokenMetadataById(id: string): Promise<TokenMetadata | null> {
	const token = await getTokenMetadata(id)
	return token
}

export function addTokenMetadata(
	tokenId: string,
	info: TokenInfo,
	tokenAddr: string,
	minterAddr: string,
	genesisTxid: string,
	revealTxid: string
) {
	const metadata: TokenMetadata = {
		info: info,
		tokenId,
		tokenAddr: tokenAddr,
		minterAddr: minterAddr,
		genesisTxid,
		revealTxid,
		timestamp: new Date().getTime()
	}
	return metadata
}
