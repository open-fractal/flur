import { UTXO } from 'scrypt-ts'
import { logerror } from './log'
import { WalletService } from '@/lib/scrypt/providers'

const OW_API_URL = 'https://fractalturbo.ordinalswallet.com'

export const getUtxos = async function(wallet: WalletService): Promise<UTXO[]> {
	return wallet.getBitcoinUtxos()
}

export const getRawTransaction = async function(txid: string): Promise<string | Error> {
	const url = `${OW_API_URL}/tx/${txid}/raw`
	return (
		fetch(url)
			.then(res => {
				if (res.status === 200) {
					return res.text()
				}
				new Error(`invalid http response code: ${res.status}`)
			})
			.then((txhex: string | undefined) => {
				if (txhex) {
					return txhex
				}
				return new Error(`invalid txhex: ${txhex}`)
			})
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.catch((e: Error) => {
				logerror('getrawtransaction failed!', e)
				return e
			})
	)
}
