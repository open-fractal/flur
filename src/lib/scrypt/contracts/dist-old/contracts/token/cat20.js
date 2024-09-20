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
exports.CAT20 = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const txUtil_1 = require("../utils/txUtil");
const txProof_1 = require("../utils/txProof");
const stateUtils_1 = require("../utils/stateUtils");
const cat20Proto_1 = require("./cat20Proto");
const guardProto_1 = require("./guardProto");
const backtrace_1 = require("../utils/backtrace");
class CAT20 extends scrypt_ts_1.SmartContract {
    constructor(minterScript, guardScript) {
        super(...arguments);
        this.minterScript = minterScript;
        this.guardScript = guardScript;
    }
    unlock(tokenUnlockArgs, 
    // verify preTx data part
    preState, preTxStatesInfo, 
    // amount check guard
    guardInfo, 
    // backtrace
    backtraceInfo, 
    // common args
    // current tx info
    shPreimage, prevoutsCtx, spentScripts) {
        // Check sighash preimage.
        (0, scrypt_ts_1.assert)(this.checkSig(sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage), sigHashUtils_1.SigHashUtils.Gx), 'preimage check error');
        // check ctx
        sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
        sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScripts, shPreimage.hashSpentScripts);
        // verify state
        stateUtils_1.StateUtils.verifyPreStateHash(preTxStatesInfo, cat20Proto_1.CAT20Proto.stateHash(preState), backtraceInfo.preTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], prevoutsCtx.outputIndexVal);
        const preScript = spentScripts[Number(prevoutsCtx.inputIndexVal)];
        backtrace_1.Backtrace.verifyToken(prevoutsCtx.spentTxhash, backtraceInfo, this.minterScript, preScript);
        // make sure the token is spent with a valid guard
        this.valitateGuard(guardInfo, preScript, preState, prevoutsCtx.inputIndexVal, prevoutsCtx.prevouts, spentScripts);
        if (tokenUnlockArgs.isUserSpend) {
            // unlock token owned by user key
            (0, scrypt_ts_1.assert)((0, scrypt_ts_1.hash160)(tokenUnlockArgs.userPubKeyPrefix +
                tokenUnlockArgs.userPubKey) == preState.ownerAddr);
            (0, scrypt_ts_1.assert)(this.checkSig(tokenUnlockArgs.userSig, tokenUnlockArgs.userPubKey));
        }
        else {
            // unlock token owned by contract script
            (0, scrypt_ts_1.assert)(preState.ownerAddr ==
                (0, scrypt_ts_1.hash160)(spentScripts[Number(tokenUnlockArgs.contractInputIndex)]));
        }
    }
    valitateGuard(guardInfo, preScript, preState, inputIndexVal, prevouts, spentScripts) {
        // check amount script
        const guardHashRoot = guardProto_1.GuardProto.stateHash(guardInfo.guardState);
        (0, scrypt_ts_1.assert)(guardInfo.guardState.tokenScript == preScript);
        (0, scrypt_ts_1.assert)(stateUtils_1.StateUtils.getStateScript(guardHashRoot, 1n) ==
            guardInfo.tx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX]);
        (0, scrypt_ts_1.assert)(preState.amount > 0n);
        (0, scrypt_ts_1.assert)(guardInfo.guardState.inputTokenAmountArray[Number(inputIndexVal)] ==
            preState.amount);
        const guardTxid = txProof_1.TxProof.getTxIdFromPreimg3(guardInfo.tx);
        (0, scrypt_ts_1.assert)(prevouts[Number(guardInfo.inputIndexVal)] ==
            guardTxid + guardInfo.outputIndex);
        (0, scrypt_ts_1.assert)(spentScripts[Number(guardInfo.inputIndexVal)] == this.guardScript);
        return true;
    }
}
exports.CAT20 = CAT20;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], CAT20.prototype, "minterScript", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], CAT20.prototype, "guardScript", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], CAT20.prototype, "unlock", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, BigInt, Object, Object]),
    __metadata("design:returntype", Boolean)
], CAT20.prototype, "valitateGuard", null);
//# sourceMappingURL=cat20.js.map