import { btc, getRawTransaction, script2P2TR, p2tr2Address } from '@/lib/scrypt/common'
import { TokenMetadata, TokenContract } from '@/lib/scrypt/common'

export async function fetchTokenTransactions(
	tokens: TokenContract[],
	metadata: TokenMetadata,
	cachedTxs: Map<string, btc.Transaction>
): Promise<
	Array<{
		prevTx: btc.Transaction
		prevTokenInputIndex: number
		prevPrevTx: btc.Transaction
	} | null>
> {
	return Promise.all(
		tokens.map(async ({ utxo: tokenUtxo }) => {
			let prevTx: btc.Transaction | null = null
			if (cachedTxs.has(tokenUtxo.txId)) {
				prevTx = cachedTxs.get(tokenUtxo.txId)!
			} else {
				const prevTxHex = await getRawTransaction(tokenUtxo.txId)
				if (prevTxHex instanceof Error) {
					console.error(`get raw transaction ${tokenUtxo.txId} failed!`, prevTxHex)
					return null
				}
				prevTx = new btc.Transaction(prevTxHex)
				cachedTxs.set(tokenUtxo.txId, prevTx)
			}

			let prevTokenInputIndex = 0

			const input = prevTx.inputs.find((input: any, inputIndex: number) => {
				const witnesses = input.getWitnesses()

				if (Array.isArray(witnesses) && witnesses.length > 2) {
					const lockingScriptBuffer = witnesses[witnesses.length - 2]
					const { p2tr } = script2P2TR(lockingScriptBuffer)

					const address = p2tr2Address(p2tr, 'fractal-mainnet')
					if (address === metadata.tokenAddr || address === metadata.minterAddr) {
						prevTokenInputIndex = inputIndex
						return true
					}
				}
			})

			if (!input) {
				console.error(`There is no valid preTx of the ftUtxo!`)
				return null
			}

			let prevPrevTx: btc.Transaction | null = null

			const prevPrevTxId = prevTx.inputs[prevTokenInputIndex].prevTxId.toString('hex')

			if (cachedTxs.has(prevPrevTxId)) {
				prevPrevTx = cachedTxs.get(prevPrevTxId)!
			} else {
				const prevPrevTxHex = await getRawTransaction(prevPrevTxId)
				if (prevPrevTxHex instanceof Error) {
					console.error(`get raw transaction ${prevPrevTxId} failed!`, prevPrevTxHex)
					return null
				}
				prevPrevTx = new btc.Transaction(prevPrevTxHex)
				cachedTxs.set(prevPrevTxId, prevPrevTx)
			}

			return {
				prevTx,
				prevTokenInputIndex,
				prevPrevTx
			}
		})
	)
}
