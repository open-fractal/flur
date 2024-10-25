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
exports.FXPSellGuard = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const txProof_1 = require("../utils/txProof");
const sellUtil_1 = require("./sellUtil");
const cat20Proto_1 = require("./cat20Proto");
const stateUtils_1 = require("../utils/stateUtils");
class FXPSellGuard extends scrypt_ts_1.SmartContract {
    constructor() {
        super(...arguments);
    }
    redeem(preTx, preState, preTxStatesInfo, 
    // ctxs
    shPreimage, prevoutsCtx, spentScriptsCtx) {
        // Check sighash preimage.
        (0, scrypt_ts_1.assert)(this.checkSig(sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage), sigHashUtils_1.SigHashUtils.Gx), 'preimage check error');
        // check ctx
        sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
        sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts);
        // Verify prev tx is a cat protocol tx
        stateUtils_1.StateUtils.verifyPreStateHash(preTxStatesInfo, cat20Proto_1.CAT20Proto.stateHash(preState), preTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], 1n);
        // Verify prev tx
        const prevTixd = txProof_1.TxProof.getTxIdFromPreimg1(preTx);
        (0, scrypt_ts_1.assert)(prevTixd == prevoutsCtx.spentTxhash, 'prevTixd error');
        // Verify prev tx service fee
        const serviceFeeScript = (0, scrypt_ts_1.toByteString)('512067fe8e4767ab1a9056b1e7c6166d690e641d3f40e188241f35f803b1f84546c2');
        const serviceFeeSats = sellUtil_1.SellUtil.int32ToSatoshiBytes(1000000n);
        (0, scrypt_ts_1.assert)(preTx.outputScriptList[3] == serviceFeeScript, 'should pay service fee address');
        (0, scrypt_ts_1.assert)(preTx.outputSatoshisList[3] == serviceFeeSats, 'should pay service fee amount');
    }
}
exports.FXPSellGuard = FXPSellGuard;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FXPSellGuard.prototype, "redeem", null);
//# sourceMappingURL=FXPSellGuard.js.map