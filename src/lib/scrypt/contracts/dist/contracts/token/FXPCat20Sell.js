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
exports.FXPCat20Sell = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const stateUtils_1 = require("../utils/stateUtils");
const cat20Proto_1 = require("./cat20Proto");
const sellUtil_1 = require("./sellUtil");
const scrypt_ts_lib_btc_1 = require("scrypt-ts-lib-btc");
class FXPCat20Sell extends scrypt_ts_1.SmartContract {
    constructor(cat20Script, recvOutput, sellerAddress, price, scalePrice) {
        super(...arguments);
        this.cat20Script = cat20Script;
        this.recvOutput = recvOutput;
        this.sellerAddress = sellerAddress;
        this.price = price;
        this.scalePrice = scalePrice;
    }
    take(curTxoStateHashes, tokenInputIndex, toBuyUserAmount, sellChange, buyUserAddress, tokenSatoshiBytes, fxpReward, 
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
            (0, scrypt_ts_1.assert)(this.checkSig(sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage), sigHashUtils_1.SigHashUtils.Gx), 'preimage check error');
            // check ctx
            sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
            sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts);
            // ensure inputs have one token input
            (0, scrypt_ts_1.assert)(spentScriptsCtx[Number(tokenInputIndex)] == this.cat20Script);
            (0, scrypt_ts_1.assert)(sellChange >= 0n);
            // build outputs
            // to buyer
            let curStateHashes = (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
                amount: toBuyUserAmount,
                ownerAddr: buyUserAddress,
            }));
            const toBuyerTokenOutput = txUtil_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            // sell token change
            let changeToSellTokenOutput = (0, scrypt_ts_1.toByteString)('');
            if (sellChange > 0n) {
                const contractAddress = (0, scrypt_ts_1.hash160)(spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)]);
                curStateHashes += (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
                    amount: sellChange,
                    ownerAddr: contractAddress,
                }));
                changeToSellTokenOutput = txUtil_1.TxUtil.buildOutput(this.cat20Script, tokenSatoshiBytes);
            }
            // satoshi to seller
            const satoshiToSeller = scrypt_ts_lib_btc_1.OpMul.mul(this.price, toBuyUserAmount);
            const toSellerOutput = txUtil_1.TxUtil.buildOutput(this.recvOutput, 
            // token 1 decimals = 1 satoshi
            sellUtil_1.SellUtil.int32ToSatoshiBytesScaled(satoshiToSeller, this.scalePrice));
            //
            const curStateCnt = sellChange == 0n ? 1n : 2n;
            const stateOutput = stateUtils_1.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
            const serviceFeeP2TR = (0, scrypt_ts_1.toByteString)('512067fe8e4767ab1a9056b1e7c6166d690e641d3f40e188241f35f803b1f84546c2');
            const serviceFeeOutput = txUtil_1.TxUtil.buildOutput(serviceFeeP2TR, sellUtil_1.SellUtil.int32ToSatoshiBytes(1000000n));
            // Only set fxp reward on full take
            let fxpSellGuardOutput = (0, scrypt_ts_1.toByteString)('');
            if (sellChange == 0n && fxpReward) {
                const fxpSellGuardP2TR = (0, scrypt_ts_1.toByteString)('51204531afe938faf1565672605241a227e4484cb728bf74eadc231d341e5c310e81');
                fxpSellGuardOutput = txUtil_1.TxUtil.buildOutput(fxpSellGuardP2TR, sellUtil_1.SellUtil.int32ToSatoshiBytes(330n));
            }
            const changeOutput = txUtil_1.TxUtil.getChangeOutput(changeInfo);
            const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput +
                toBuyerTokenOutput +
                changeToSellTokenOutput +
                toSellerOutput +
                serviceFeeOutput +
                fxpSellGuardOutput +
                changeOutput);
            (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
        }
    }
}
exports.FXPCat20Sell = FXPCat20Sell;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], FXPCat20Sell.prototype, "cat20Script", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], FXPCat20Sell.prototype, "recvOutput", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], FXPCat20Sell.prototype, "sellerAddress", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], FXPCat20Sell.prototype, "price", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", Boolean)
], FXPCat20Sell.prototype, "scalePrice", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BigInt, BigInt, BigInt, String, String, Boolean, Boolean, String, String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FXPCat20Sell.prototype, "take", null);
//# sourceMappingURL=FXPCat20Sell.js.map