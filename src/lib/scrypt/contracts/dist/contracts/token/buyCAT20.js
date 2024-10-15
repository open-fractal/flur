"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyCAT20 = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const index_1 = require("../../index");
const index_2 = require("../../index");
const index_3 = require("../../index");
const index_4 = require("../../index");
const sellUtil_1 = require("./sellUtil");
const scrypt_ts_lib_btc_1 = require("scrypt-ts-lib-btc");
class BuyCAT20 extends scrypt_ts_1.SmartContract {
    constructor(cat20Script, buyerAddress, price) {
        super(...arguments);
        this.cat20Script = cat20Script;
        this.buyerAddress = buyerAddress;
        this.price = price;
    }
    take(curTxoStateHashes, preRemainingSatoshis, toBuyerAmount, toSellerAmount, toSellerAddress, tokenSatoshiBytes, tokenInputIndex, 
    // sig data
    cancel, pubKeyPrefix, ownerPubKey, ownerSig, 
    // ctxs
    shPreimage, prevoutsCtx, spentScriptsCtx, spentAmountsCtx, changeInfo) {
        // check preimage
        if (cancel) {
            (0, scrypt_ts_1.assert)((0, scrypt_ts_1.hash160)(pubKeyPrefix + ownerPubKey) == this.buyerAddress);
            (0, scrypt_ts_1.assert)(this.checkSig(ownerSig, ownerPubKey));
        }
        else {
            // Check sighash preimage.
            (0, scrypt_ts_1.assert)(this.checkSig(index_2.SigHashUtils.checkSHPreimage(shPreimage), index_2.SigHashUtils.Gx), 'preimage check error');
            // check ctx
            index_2.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
            index_2.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts);
            (0, scrypt_ts_1.assert)(spentScriptsCtx[Number(tokenInputIndex)] == this.cat20Script, 'should spend the cat20Script');
            sellUtil_1.SellUtil.checkSpentAmountsCtx(spentAmountsCtx, shPreimage.hashSpentAmounts);
            (0, scrypt_ts_1.assert)(toSellerAmount >= 0n, 'Invalid to seller amount');
            (0, scrypt_ts_1.assert)(spentAmountsCtx[Number(prevoutsCtx.inputIndexVal)] ==
                sellUtil_1.SellUtil.int32ToSatoshiBytes(preRemainingSatoshis), 'Invalid preRemainingSatoshis');
            const costSatoshis = scrypt_ts_lib_btc_1.OpMul.mul(this.price, toBuyerAmount);
            (0, scrypt_ts_1.assert)(preRemainingSatoshis >= costSatoshis, 'Insufficient satoshis balance');
            // to buyer
            let curStateHashes = (0, scrypt_ts_1.hash160)(index_4.CAT20Proto.stateHash({
                amount: toBuyerAmount,
                ownerAddr: this.buyerAddress,
            }));
            const toBuyerTokenOutput = index_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            // sell token change
            let toSellerTokenOutput = (0, scrypt_ts_1.toByteString)('');
            if (toSellerAmount > 0n) {
                curStateHashes += (0, scrypt_ts_1.hash160)(index_4.CAT20Proto.stateHash({
                    amount: toSellerAmount,
                    ownerAddr: toSellerAddress,
                }));
                toSellerTokenOutput = index_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            }
            // remaining buyer utxo satoshi
            const remainingSatoshis = preRemainingSatoshis - costSatoshis;
            let remainingOutput = (0, scrypt_ts_1.toByteString)('');
            if (remainingSatoshis > 0n) {
                const selfSpentScript = spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)];
                remainingOutput = index_1.TxUtil.buildOutput(selfSpentScript, sellUtil_1.SellUtil.int32ToSatoshiBytes(remainingSatoshis));
            }
            //
            const curStateCnt = toSellerAmount == 0n ? 1n : 2n;
            const stateOutput = index_3.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
            const changeOutput = index_1.TxUtil.getChangeOutput(changeInfo);
            const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput +
                toBuyerTokenOutput +
                toSellerTokenOutput +
                remainingOutput +
                changeOutput);
            (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
        }
    }
}
exports.BuyCAT20 = BuyCAT20;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], BuyCAT20.prototype, "cat20Script", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], BuyCAT20.prototype, "buyerAddress", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], BuyCAT20.prototype, "price", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BigInt, BigInt, BigInt, String, String, BigInt, Boolean, String, String, String, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], BuyCAT20.prototype, "take", null);
//# sourceMappingURL=buyCAT20.js.map