import { Transaction } from '@scure/btc-signer'
import { btc } from '@/lib/scrypt/common'
import { UTXO } from 'scrypt-ts'
import { WalletService } from '@/lib/scrypt/providers'

export async function psbtFromTx(
	tx: btc.Transaction,
	utxos: UTXO[],
	wallet: WalletService
): Promise<Transaction> {
	const psbt = Transaction.fromRaw(tx.toBuffer(), {
		allowUnknownInputs: true,
		allowUnknownOutputs: true
	})

	// @ts-ignore
	for (let i = 0; i < psbt.inputs.length; i++) {
		const utxo = utxos.find(
			utxo =>
				// @ts-ignore
				utxo.txId === Buffer.from(psbt.inputs[i].txid).toString('hex') &&
				// @ts-ignore
				utxo.outputIndex === psbt.inputs[i].index
		)

		if (!utxo) {
			continue
		}

		// @ts-ignore
		psbt.inputs[i].witnessUtxo = {
			amount: BigInt(utxo?.satoshis) || 0n,
			script: Buffer.from(utxo?.script, 'hex') || btc.Script.empty()
		}

		// @ts-ignore
		if (!psbt.inputs[i].finalScriptWitess && !psbt.inputs[i]?.finalScriptWitess?.length) {
			// @ts-ignore
			psbt.inputs[i].tapInternalKey = Buffer.from(await wallet.getXOnlyPublicKey(), 'hex')
			// @ts-ignore
			psbt.inputs[i].sighashType = 1
		}
	}

	// process.exit()
	return psbt
}
