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
exports.TransferGuard = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const txUtil_1 = require("../utils/txUtil");
const guardProto_1 = require("./guardProto");
const stateUtils_1 = require("../utils/stateUtils");
class TransferGuard extends scrypt_ts_1.SmartContract {
    transfer(curTxoStateHashes, 
    // token owner address or other output locking script
    ownerAddrOrScriptList, tokenAmountList, tokenOutputMaskList, outputSatoshisList, tokenSatoshis, 
    // verify preTx data part
    preState, 
    // check deploy tx
    preTx, 
    //
    shPreimage, prevoutsCtx, spentScripts) {
        // Check sighash preimage.
        (0, scrypt_ts_1.assert)(this.checkSig(sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage), sigHashUtils_1.SigHashUtils.Gx), 'preimage check error');
        // check ctx
        sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
        sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScripts, shPreimage.hashSpentScripts);
        // check preTx
        stateUtils_1.StateUtils.verifyGuardStateHash(preTx, prevoutsCtx.spentTxhash, guardProto_1.GuardProto.stateHash(preState));
        // sum input amount
        let sumInputToken = 0n;
        for (let i = 0; i < txUtil_1.MAX_INPUT; i++) {
            const script = spentScripts[i];
            if (script == preState.tokenScript) {
                const preSumInputToken = sumInputToken;
                sumInputToken += preState.inputTokenAmountArray[i];
                (0, scrypt_ts_1.assert)(sumInputToken > preSumInputToken);
            }
        }
        let stateHashString = (0, scrypt_ts_1.toByteString)('');
        let outputs = (0, scrypt_ts_1.toByteString)('');
        let sumOutputToken = 0n;
        const tokenOutput = txUtil_1.TxUtil.buildOutput(preState.tokenScript, tokenSatoshis);
        // sum output amount, build token outputs, build token state hash
        for (let i = 0; i < txUtil_1.MAX_STATE; i++) {
            const addrOrScript = ownerAddrOrScriptList[i];
            if (tokenOutputMaskList[i]) {
                // token owner address
                const tokenAmount = tokenAmountList[i];
                (0, scrypt_ts_1.assert)(tokenAmount > 0n);
                sumOutputToken = sumOutputToken + tokenAmount;
                outputs = outputs + tokenOutput;
                const tokenStateHash = (0, scrypt_ts_1.hash160)((0, scrypt_ts_1.hash160)(addrOrScript + (0, scrypt_ts_1.int2ByteString)(tokenAmount)));
                (0, scrypt_ts_1.assert)((0, scrypt_ts_1.hash160)(curTxoStateHashes[i]) == tokenStateHash);
                stateHashString += tokenStateHash;
            }
            else {
                // other output locking script
                (0, scrypt_ts_1.assert)(addrOrScript != preState.tokenScript);
                stateHashString += (0, scrypt_ts_1.hash160)(curTxoStateHashes[i]);
                if ((0, scrypt_ts_1.len)(addrOrScript) > 0) {
                    outputs += txUtil_1.TxUtil.buildOutput(addrOrScript, outputSatoshisList[i]);
                }
            }
        }
        (0, scrypt_ts_1.assert)(sumInputToken > 0n);
        (0, scrypt_ts_1.assert)(sumInputToken == sumOutputToken);
        const stateOutput = txUtil_1.TxUtil.buildOpReturnRoot(txUtil_1.TxUtil.getStateScript((0, scrypt_ts_1.hash160)(stateHashString)));
        const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput + outputs);
        (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
    }
}
exports.TransferGuard = TransferGuard;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, String, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], TransferGuard.prototype, "transfer", null);
//# sourceMappingURL=transferGuard.js.map