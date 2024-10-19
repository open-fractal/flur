'use strict'
var __decorate =
	(this && this.__decorate) ||
	function(decorators, target, key, desc) {
		var c = arguments.length,
			r =
				c < 3
					? target
					: desc === null
					? (desc = Object.getOwnPropertyDescriptor(target, key))
					: desc,
			d
		if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
			r = Reflect.decorate(decorators, target, key, desc)
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i]))
					r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
		return c > 3 && r && Object.defineProperty(target, key, r), r
	}
var __metadata =
	(this && this.__metadata) ||
	function(k, v) {
		if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
			return Reflect.metadata(k, v)
	}
Object.defineProperty(exports, '__esModule', { value: true })
exports.FXPCat20Buy = void 0
const scrypt_ts_1 = require('scrypt-ts')
const txUtil_1 = require('../utils/txUtil')
const sigHashUtils_1 = require('../utils/sigHashUtils')
const stateUtils_1 = require('../utils/stateUtils')
const cat20Proto_1 = require('./cat20Proto')
const sellUtil_1 = require('./sellUtil')
const scrypt_ts_lib_btc_1 = require('scrypt-ts-lib-btc')
class FXPCat20Buy extends scrypt_ts_1.SmartContract {
	constructor(cat20Script, buyerAddress, price, scalePrice) {
		super(...arguments)
		this.cat20Script = cat20Script
		this.buyerAddress = buyerAddress
		this.price = price
		this.scalePrice = scalePrice
	}
	take(
		curTxoStateHashes,
		preRemainingAmount,
		toBuyerAmount,
		toSellerAmount,
		toSellerAddress,
		tokenSatoshiBytes,
		tokenInputIndex,
		//
		fxpReward,
		// sig data
		cancel,
		pubKeyPrefix,
		ownerPubKey,
		ownerSig,
		// ctxs
		shPreimage,
		prevoutsCtx,
		spentScriptsCtx,
		spentAmountsCtx,
		changeInfo
	) {
		// check preimage
		if (cancel) {
			;(0, scrypt_ts_1.assert)(
				(0, scrypt_ts_1.hash160)(pubKeyPrefix + ownerPubKey) == this.buyerAddress
			)
			;(0, scrypt_ts_1.assert)(this.checkSig(ownerSig, ownerPubKey))
		} else {
			// Check sighash preimage.
			;(0, scrypt_ts_1.assert)(
				this.checkSig(
					sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage),
					sigHashUtils_1.SigHashUtils.Gx
				),
				'preimage check error'
			)
			// check ctx
			sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(
				prevoutsCtx,
				shPreimage.hashPrevouts,
				shPreimage.inputIndex
			)
			sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts)
			;(0, scrypt_ts_1.assert)(
				spentScriptsCtx[Number(tokenInputIndex)] == this.cat20Script,
				'should spend the cat20Script'
			)
			sellUtil_1.SellUtil.checkSpentAmountsCtx(spentAmountsCtx, shPreimage.hashSpentAmounts)
			;(0, scrypt_ts_1.assert)(toSellerAmount >= 0n, 'Invalid to seller amount')
			const preRemainingSatoshis = scrypt_ts_lib_btc_1.OpMul.mul(this.price, preRemainingAmount)
			;(0, scrypt_ts_1.assert)(
				spentAmountsCtx[Number(prevoutsCtx.inputIndexVal)] ==
					sellUtil_1.SellUtil.int32ToSatoshiBytesScaled(preRemainingSatoshis, this.scalePrice),
				'Invalid preRemainingSatoshis'
			)
			// const costSatoshis = scrypt_ts_lib_btc_1.OpMul.mul(this.price, toBuyerAmount);
			;(0, scrypt_ts_1.assert)(preRemainingAmount >= toBuyerAmount, 'Insufficient satoshis balance')
			// to buyer
			let curStateHashes = (0, scrypt_ts_1.hash160)(
				cat20Proto_1.CAT20Proto.stateHash({
					amount: toBuyerAmount,
					ownerAddr: this.buyerAddress
				})
			)
			const toBuyerTokenOutput = txUtil_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes)
			// sell token change
			let toSellerTokenOutput = (0, scrypt_ts_1.toByteString)('')
			if (toSellerAmount > 0n) {
				curStateHashes += (0, scrypt_ts_1.hash160)(
					cat20Proto_1.CAT20Proto.stateHash({
						amount: toSellerAmount,
						ownerAddr: toSellerAddress
					})
				)
				toSellerTokenOutput = txUtil_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes)
			}
			// remaining buyer utxo satoshi
			const remainingSatoshis = scrypt_ts_lib_btc_1.OpMul.mul(
				this.price,
				preRemainingAmount - toBuyerAmount
			)
			let remainingOutput = (0, scrypt_ts_1.toByteString)('')
			if (remainingSatoshis > 0n) {
				const selfSpentScript = spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)]
				remainingOutput = txUtil_1.TxUtil.buildOutput(
					selfSpentScript,
					sellUtil_1.SellUtil.int32ToSatoshiBytesScaled(remainingSatoshis, this.scalePrice)
				)
			}
			//
			const curStateCnt = toSellerAmount == 0n ? 1n : 2n
			const stateOutput = stateUtils_1.StateUtils.getCurrentStateOutput(
				curStateHashes,
				curStateCnt,
				curTxoStateHashes
			)
			const serviceFeeP2TR = (0, scrypt_ts_1.toByteString)(
				'512067fe8e4767ab1a9056b1e7c6166d690e641d3f40e188241f35f803b1f84546c2'
			)
			const serviceFeeOutput = txUtil_1.TxUtil.buildOutput(
				serviceFeeP2TR,
				sellUtil_1.SellUtil.int32ToSatoshiBytes(1000000n)
			)
			const fxpBuyGuardP2TR = (0, scrypt_ts_1.toByteString)(
				'5120629546ef6334959d5d9c0ab8268c3f04d23b56658c1f3ad34d94555a9f7db8b3'
			)
			let fxpBuyGuardOutput = (0, scrypt_ts_1.toByteString)('')
			if (remainingSatoshis == 0n && fxpReward) {
				fxpBuyGuardOutput = txUtil_1.TxUtil.buildOutput(
					fxpBuyGuardP2TR,
					sellUtil_1.SellUtil.int32ToSatoshiBytes(330n)
				)
			}
			const changeOutput = txUtil_1.TxUtil.getChangeOutput(changeInfo)
			const hashOutputs = (0, scrypt_ts_1.sha256)(
				stateOutput +
					toBuyerTokenOutput +
					toSellerTokenOutput +
					remainingOutput +
					serviceFeeOutput +
					fxpBuyGuardOutput +
					changeOutput
			)
			;(0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch')
		}
	}
}
exports.FXPCat20Buy = FXPCat20Buy
__decorate(
	[(0, scrypt_ts_1.prop)(), __metadata('design:type', String)],
	FXPCat20Buy.prototype,
	'cat20Script',
	void 0
)
__decorate(
	[(0, scrypt_ts_1.prop)(), __metadata('design:type', String)],
	FXPCat20Buy.prototype,
	'buyerAddress',
	void 0
)
__decorate(
	[(0, scrypt_ts_1.prop)(), __metadata('design:type', BigInt)],
	FXPCat20Buy.prototype,
	'price',
	void 0
)
__decorate(
	[(0, scrypt_ts_1.prop)(), __metadata('design:type', Boolean)],
	FXPCat20Buy.prototype,
	'scalePrice',
	void 0
)
__decorate(
	[
		(0, scrypt_ts_1.method)(),
		__metadata('design:type', Function),
		__metadata('design:paramtypes', [
			Object,
			BigInt,
			BigInt,
			BigInt,
			String,
			String,
			BigInt,
			Boolean,
			Boolean,
			String,
			String,
			String,
			Object,
			Object,
			Object,
			Object,
			Object
		]),
		__metadata('design:returntype', void 0)
	],
	FXPCat20Buy.prototype,
	'take',
	null
)
//# sourceMappingURL=FXPCat20Buy.js.map
