"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyCAT20 = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const cat_smartcontracts_1 = require("@cat-protocol/cat-smartcontracts");
const cat_smartcontracts_2 = require("@cat-protocol/cat-smartcontracts");
const cat_smartcontracts_3 = require("@cat-protocol/cat-smartcontracts");
const cat_smartcontracts_4 = require("@cat-protocol/cat-smartcontracts");
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
            (0, scrypt_ts_1.assert)(this.checkSig(cat_smartcontracts_2.SigHashUtils.checkSHPreimage(shPreimage), cat_smartcontracts_2.SigHashUtils.Gx), 'preimage check error');
            // check ctx
            cat_smartcontracts_2.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
            cat_smartcontracts_2.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts);
            (0, scrypt_ts_1.assert)(spentScriptsCtx[Number(tokenInputIndex)] == this.cat20Script, 'should spend the cat20Script');
            sellUtil_1.SellUtil.checkSpentAmountsCtx(spentAmountsCtx, shPreimage.hashSpentAmounts);
            (0, scrypt_ts_1.assert)(toSellerAmount >= 0n, 'Invalid to seller amount');
            (0, scrypt_ts_1.assert)(spentAmountsCtx[Number(prevoutsCtx.inputIndexVal)] ==
                sellUtil_1.SellUtil.int32ToSatoshiBytes(preRemainingSatoshis), 'Invalid preRemainingSatoshis');
            const costSatoshis = scrypt_ts_lib_btc_1.OpMul.mul(this.price, toBuyerAmount);
            (0, scrypt_ts_1.assert)(preRemainingSatoshis >= costSatoshis, 'Insufficient satoshis balance');
            // to buyer
            let curStateHashes = (0, scrypt_ts_1.hash160)(cat_smartcontracts_4.CAT20Proto.stateHash({
                amount: toBuyerAmount,
                ownerAddr: this.buyerAddress,
            }));
            const toBuyerTokenOutput = cat_smartcontracts_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            // sell token change
            let toSellerTokenOutput = (0, scrypt_ts_1.toByteString)('');
            if (toSellerAmount > 0n) {
                curStateHashes += (0, scrypt_ts_1.hash160)(cat_smartcontracts_4.CAT20Proto.stateHash({
                    amount: toSellerAmount,
                    ownerAddr: toSellerAddress,
                }));
                toSellerTokenOutput = cat_smartcontracts_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            }
            // remaining buyer utxo satoshi
            const remainingSatoshis = preRemainingSatoshis - costSatoshis;
            let remainingOutput = (0, scrypt_ts_1.toByteString)('');
            if (remainingSatoshis > 0n) {
                const selfSpentScript = spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)];
                remainingOutput = cat_smartcontracts_1.TxUtil.buildOutput(selfSpentScript, sellUtil_1.SellUtil.int32ToSatoshiBytes(remainingSatoshis));
            }
            //
            const curStateCnt = toSellerAmount == 0n ? 1n : 2n;
            const stateOutput = cat_smartcontracts_3.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
            const changeOutput = cat_smartcontracts_1.TxUtil.getChangeOutput(changeInfo);
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
    (0, scrypt_ts_1.prop)()
], BuyCAT20.prototype, "cat20Script", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], BuyCAT20.prototype, "buyerAddress", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], BuyCAT20.prototype, "price", void 0);
__decorate([
    (0, scrypt_ts_1.method)()
], BuyCAT20.prototype, "take", null);
//# sourceMappingURL=buyCAT20.js.map