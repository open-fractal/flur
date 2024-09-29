"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAT20Sell = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const cat_smartcontracts_1 = require("@cat-protocol/cat-smartcontracts");
const cat_smartcontracts_2 = require("@cat-protocol/cat-smartcontracts");
const cat_smartcontracts_3 = require("@cat-protocol/cat-smartcontracts");
const cat_smartcontracts_4 = require("@cat-protocol/cat-smartcontracts");
const sellUtil_1 = require("./sellUtil");
const scrypt_ts_lib_btc_1 = require("scrypt-ts-lib-btc");
class CAT20Sell extends scrypt_ts_1.SmartContract {
    constructor(cat20Script, recvOutput, sellerAddress, price) {
        super(...arguments);
        this.cat20Script = cat20Script;
        this.recvOutput = recvOutput;
        this.sellerAddress = sellerAddress;
        this.price = price;
    }
    take(curTxoStateHashes, tokenInputIndex, toBuyUserAmount, sellChange, buyUserAddress, tokenSatoshiBytes, 
    // sig data
    cancel, pubKeyPrefix, ownerPubKey, ownerSig, 
    // ctxs
    shPreimage, prevoutsCtx, spentScriptsCtx, changeInfo) {
        // check preimage
        if (cancel) {
            (0, scrypt_ts_1.assert)((0, scrypt_ts_1.hash160)(pubKeyPrefix + ownerPubKey) == this.sellerAddress);
            (0, scrypt_ts_1.assert)(this.checkSig(ownerSig, ownerPubKey));
        }
        else {
            // Check sighash preimage.
            (0, scrypt_ts_1.assert)(this.checkSig(cat_smartcontracts_2.SigHashUtils.checkSHPreimage(shPreimage), cat_smartcontracts_2.SigHashUtils.Gx), 'preimage check error');
            // check ctx
            cat_smartcontracts_2.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
            cat_smartcontracts_2.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts);
            // ensure inputs have one token input
            (0, scrypt_ts_1.assert)(spentScriptsCtx[Number(tokenInputIndex)] == this.cat20Script);
            (0, scrypt_ts_1.assert)(sellChange >= 0n);
            // build outputs
            // to buyer
            let curStateHashes = (0, scrypt_ts_1.hash160)(cat_smartcontracts_4.CAT20Proto.stateHash({
                amount: toBuyUserAmount,
                ownerAddr: buyUserAddress,
            }));
            const toBuyerTokenOutput = cat_smartcontracts_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            // sell token change
            let changeToSellTokenOutput = (0, scrypt_ts_1.toByteString)('');
            if (sellChange > 0n) {
                const contractAddress = (0, scrypt_ts_1.hash160)(spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)]);
                curStateHashes += (0, scrypt_ts_1.hash160)(cat_smartcontracts_4.CAT20Proto.stateHash({
                    amount: sellChange,
                    ownerAddr: contractAddress,
                }));
                changeToSellTokenOutput = cat_smartcontracts_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            }
            // satoshi to seller
            const satoshiToSeller = scrypt_ts_lib_btc_1.OpMul.mul(this.price, toBuyUserAmount);
            const toSellerOutput = cat_smartcontracts_1.TxUtil.buildOutput(this.recvOutput, 
            // token 1 decimals = 1 satoshi
            sellUtil_1.SellUtil.int32ToSatoshiBytes(satoshiToSeller));
            //
            const curStateCnt = sellChange == 0n ? 1n : 2n;
            const stateOutput = cat_smartcontracts_3.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
            const changeOutput = cat_smartcontracts_1.TxUtil.getChangeOutput(changeInfo);
            const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput +
                toBuyerTokenOutput +
                changeToSellTokenOutput +
                toSellerOutput +
                changeOutput);
            (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
        }
    }
}
exports.CAT20Sell = CAT20Sell;
__decorate([
    (0, scrypt_ts_1.prop)()
], CAT20Sell.prototype, "cat20Script", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], CAT20Sell.prototype, "recvOutput", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], CAT20Sell.prototype, "sellerAddress", void 0);
__decorate([
    (0, scrypt_ts_1.prop)()
], CAT20Sell.prototype, "price", void 0);
__decorate([
    (0, scrypt_ts_1.method)()
], CAT20Sell.prototype, "take", null);
//# sourceMappingURL=cat20Sell.js.map