import { NextApiRequest, NextApiResponse } from 'next'
import { btc, toXOnly } from '@/lib/scrypt/common'

type ResponseData = {
	pub?: string
	priv?: string
	message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	try {
		const pk = btc.PrivateKey.fromRandom()
		const { tweakedPrivKey } = pk.createTapTweak()
		const taproot_private_key = btc.PrivateKey.fromBuffer(tweakedPrivKey)
		const publicKey = taproot_private_key.toPublicKey()
		const pubkeyX = toXOnly(publicKey.toBuffer()).toString('hex')

		const response = {
			pub: pubkeyX,
			priv: taproot_private_key.toString()
		}
		res.status(200).json(response)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}
