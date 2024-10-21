import {
	OpenMinterState,
	ProtocolState,
	ProtocolStateList,
	OpenMinterV2State
} from '@/lib/scrypt/contracts/dist'
import { OpenMinterContract, MinterType } from '@/lib/scrypt/common'
import { OpenMinterTokenInfo, TokenMetadata } from './metadata'
import { isOpenMinter } from './minterFinder'
import { getRawTransaction } from './apis'
import { getTokenContractP2TR, p2tr2Address, script2P2TR, toP2tr } from './utils'
import { byteString2Int } from 'scrypt-ts'
import { scaleConfig } from '@/lib/scrypt/token'
import { logerror } from './log'
import { btc } from './btc'
import { API_URL } from '@/lib/constants'
import { TokenContract } from './contact'

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')

export type ContractJSON = {
	utxo: {
		txId: string
		outputIndex: number
		script: string
		satoshis: number
	}
	txoStateHashes: Array<string>
	state: any
}

export type BalanceJSON = {
	blockHeight: number
	balances: Array<{
		tokenId: string
		confirmed: string
	}>
}

export const parseTokenMetadata = (token: any): TokenMetadata => {
	if (token.info.max) {
		// convert string to  bigint
		token.info.max = BigInt(token.info.max)
		token.info.premine = BigInt(token.info.premine)
		token.info.limit = BigInt(token.info.limit)
	}
	return token as TokenMetadata
}

export const getTokenMetadata = async function(id: string): Promise<TokenMetadata | null> {
	const url = `${API_URL}/api/tokens/${id}`

	try {
		const response = await fetch(url)
		const res = await response.json()

		if (res.code === 0) {
			if (res.data === null) {
				return null
			}
			const token = parseTokenMetadata(res.data)

			// If tokenAddr is not present, calculate it
			if (!token.tokenAddr) {
				const { BurnGuard, TransferGuard, CAT20 } = await import('@/lib/scrypt/contracts/dist')
				BurnGuard.loadArtifact(BurnGuardArtifact)
				TransferGuard.loadArtifact(TransferGuardArtifact)
				CAT20.loadArtifact(CAT20Artifact)

				const minterP2TR = toP2tr(token.minterAddr)
				const network = 'fractal-mainnet'
				token.tokenAddr = p2tr2Address(getTokenContractP2TR(minterP2TR).p2tr, network)
			}
			return token
		} else {
			throw new Error(res.msg)
		}
	} catch (e) {
		console.error(`get token metadata failed!`, e)
		return null
	}
}

export const getTokenMinterCount = async function(id: string): Promise<number> {
	const url = `${API_URL}/api/minters/${id}/utxoCount`
	return fetch(url)
		.then(res => res.json())
		.then((res: any) => {
			if (res.code === 0) {
				return res.data
			} else {
				throw new Error(res.msg)
			}
		})
		.then(({ count }) => {
			return count
		})
		.catch(e => {
			logerror(`fetch token minter count failed!`, e)
			return 0
		})
}

const fetchOpenMinterState = async function(
	metadata: TokenMetadata,
	txId: string,
	vout: number
): Promise<OpenMinterState | OpenMinterV2State | null> {
	const minterP2TR = toP2tr(metadata.minterAddr)
	const tokenP2TR = toP2tr(metadata.tokenAddr)
	const info = metadata.info as OpenMinterTokenInfo
	const scaledInfo = scaleConfig(info)
	if (txId === metadata.revealTxid) {
		if (
			// @ts-ignore
			metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2 ||
			// @ts-ignore
			metadata.info.minterMd5 === MinterType.FXP_OPEN_MINTER
		) {
			return {
				isPremined: false,
				remainingSupplyCount: (scaledInfo.max - scaledInfo.premine) / scaledInfo.limit,
				tokenScript: tokenP2TR
			}
		}
		return {
			isPremined: false,
			remainingSupply: scaledInfo.max - scaledInfo.premine,
			tokenScript: tokenP2TR
		}
	}

	const txhex = await getRawTransaction(txId)
	if (txhex instanceof Error) {
		logerror(`get raw transaction ${txId} failed!`, txhex)
		return null
	}

	const tx = new btc.Transaction(txhex)

	const REMAININGSUPPLY_WITNESS_INDEX = 16

	for (let i = 0; i < tx.inputs.length; i++) {
		const witnesses = tx.inputs[i].getWitnesses()

		if (witnesses.length > 2) {
			const lockingScriptBuffer = witnesses[witnesses.length - 2]
			const { p2tr } = script2P2TR(lockingScriptBuffer)
			if (p2tr === minterP2TR) {
				// @ts-ignore
				if (metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2) {
					const preState: OpenMinterV2State = {
						tokenScript: witnesses[REMAININGSUPPLY_WITNESS_INDEX - 2].toString('hex'),
						isPremined: true,
						remainingSupplyCount: byteString2Int(witnesses[6 + vout].toString('hex'))
					}

					return preState
					// @ts-ignore
				} else if (metadata.info.minterMd5 == MinterType.FXP_OPEN_MINTER) {
					const preState: OpenMinterV2State = {
						tokenScript: tokenP2TR,
						isPremined: true,
						remainingSupplyCount: byteString2Int(witnesses[7 + vout].toString('hex'))
					}

					return preState
				}
				const preState: OpenMinterState = {
					tokenScript: witnesses[REMAININGSUPPLY_WITNESS_INDEX - 2].toString('hex'),
					isPremined: true,
					remainingSupply: byteString2Int(witnesses[6 + vout].toString('hex'))
				}

				return preState
			}
		}
	}

	return null
}

export const parseTokens = (tokens: any): TokenContract[] => {
	return tokens.map((c: any) => {
		const protocolState = ProtocolState.fromStateHashList(c.txoStateHashes as ProtocolStateList)

		if (typeof c.utxo.satoshis === 'string') {
			c.utxo.satoshis = parseInt(c.utxo.satoshis)
		}

		const r: TokenContract = {
			utxo: c.utxo,
			state: {
				protocolState,
				data: {
					ownerAddr: c.state.address,
					amount: BigInt(c.state.amount)
				}
			}
		}

		return r
	})
}

export const parseTokenMinter = (
	metadata: TokenMetadata,
	minter: any
): Promise<OpenMinterContract[]> => {
	const contracts = [minter]
	console.log('metadata', metadata)
	if (isOpenMinter(metadata.info.minterMd5)) {
		return Promise.all(
			contracts.map(async (c: any) => {
				const protocolState = ProtocolState.fromStateHashList(c.txoStateHashes as ProtocolStateList)

				const data = await fetchOpenMinterState(metadata, c.utxo.txId, c.utxo.outputIndex)

				if (data === null) {
					throw new Error(
						`fetch open minter state failed, minter: ${metadata.minterAddr}, txId: ${c.utxo.txId}`
					)
				}

				if (typeof c.utxo.satoshis === 'string') {
					c.utxo.satoshis = parseInt(c.utxo.satoshis)
				}

				return {
					utxo: c.utxo,
					state: {
						protocolState,
						data
					}
				} as OpenMinterContract
			})
		)
	} else {
		throw new Error('Unkown minter!')
	}
}

export const getTokenMinter = async function(
	metadata: TokenMetadata,
	offset: number = 0
): Promise<OpenMinterContract | null> {
	const url = `${API_URL}/api/minters/${metadata.tokenId}/utxos?limit=500&offset=${offset}`
	return fetch(url)
		.then(res => res.json())
		.then((res: any) => {
			if (res.code === 0) {
				return res.data
			} else {
				throw new Error(res.msg)
			}
		})
		.then(({ utxos: contracts }) => {
			// Randomly select a contract from the available contracts
			const randomIndex = Math.floor(Math.random() * contracts.length)
			const selectedContract = contracts[randomIndex]

			// If no contracts are available, return null
			if (!selectedContract) {
				throw new Error('No minters available')
			}

			// Add a comment explaining the random selection
			// This random selection helps distribute the load across different minter UTXOs
			// and can prevent potential bottlenecks or overuse of a single UTXO
			return parseTokenMinter(metadata, selectedContract)
		})
		.then(minters => {
			return minters[0] || null
		})
		.catch(e => {
			logerror(`fetch minters failed, minter: ${metadata.minterAddr}`, e)
			return null
		})
}
