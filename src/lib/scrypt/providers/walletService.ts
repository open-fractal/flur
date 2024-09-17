import { AddressType } from '@/lib/scrypt/common'
import { hash160, UTXO } from 'scrypt-ts'
import { payments } from 'bitcoinjs-lib'
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs'
import { initEccLib } from 'bitcoinjs-lib'

initEccLib(ecc)

export class WalletService {
	private address: string
	private publicKey: string
	private addressType: AddressType

	constructor(address: string, publicKey: string) {
		this.address = address
		this.publicKey = publicKey
		this.addressType = AddressType.P2TR
	}

	getAddressType = () => {
		return this.addressType || AddressType.P2TR
	}

	async getDefaultAddress(): Promise<string> {
		return this.address
	}

	async getP2TRAddress(): Promise<string> {
		return this.address
	}

	async getAddress(): Promise<string> {
		return this.address
	}

	async getXOnlyPublicKey(): Promise<string> {
		const address = await this.getAddress()
		const res = payments.p2tr({ address: address })

		if (!res.pubkey) {
			throw new Error('Failed to get public key')
		}

		const pubkey = Buffer.from(res.pubkey).toString('hex')

		return pubkey
	}

	async getPublicKey(): Promise<string> {
		return this.publicKey
	}

	async getPubKeyPrefix(): Promise<string> {
		const addressType = this.getAddressType()
		if (addressType === AddressType.P2TR) {
			return ''
		} else {
			const pubkey = await this.getPublicKey()
			return pubkey.slice(0, 2)
		}
	}

	async getTokenAddress(): Promise<string> {
		const addressType = this.getAddressType()

		if (addressType === AddressType.P2TR) {
			const xpubkey = await this.getXOnlyPublicKey()
			return hash160(xpubkey)
		} else {
			const pubkey = await this.getPublicKey()
			return hash160(pubkey)
		}
	}

	async getBitcoinUtxos(): Promise<UTXO[]> {
		const utxos = await window.unisat.getBitcoinUtxos()

		const scryptUtxos = utxos.map((utxo: any) => ({
			txId: utxo.txid,
			outputIndex: utxo.vout,
			script: utxo.scriptPk,
			satoshis: utxo.satoshis
		}))

		return scryptUtxos.sort((a, b) => a.satoshis - b.satoshis)
	}
}
