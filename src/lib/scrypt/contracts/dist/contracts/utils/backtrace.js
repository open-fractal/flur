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
exports.Backtrace = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txProof_1 = require("./txProof");
const txUtil_1 = require("./txUtil");
class Backtrace extends scrypt_ts_1.SmartContractLib {
    static verifyUnique(preTxid, backtraceInfo, genesisOutpoint, expectedScript) {
        // verify tx id
        (0, scrypt_ts_1.assert)(preTxid == txProof_1.TxProof.getTxIdFromPreimg1(backtraceInfo.preTx));
        (0, scrypt_ts_1.assert)(txProof_1.TxProof.mergeInput(backtraceInfo.preTxInput) ==
            backtraceInfo.preTx.inputs[Number(backtraceInfo.preTxInputIndex)]);
        (0, scrypt_ts_1.assert)(txUtil_1.TxUtil.checkIndex(backtraceInfo.preTxInput.outputIndexVal, backtraceInfo.preTxInput.outputIndex));
        // verify the specified output of prevTx is an input of tx
        const prevOutpoint = backtraceInfo.preTxInput.txhash +
            backtraceInfo.preTxInput.outputIndex;
        if (prevOutpoint != genesisOutpoint) {
            // check if prevTx's script code is same with scriptCodeHash
            txProof_1.TxProof.verifyOutput(backtraceInfo.prePreTx, backtraceInfo.preTxInput.txhash, backtraceInfo.preTxInput.outputIndexVal, expectedScript);
        }
        return true;
    }
    static verifyToken(preTxid, backtraceInfo, minterScript, expectedScript) {
        // verify tx id
        (0, scrypt_ts_1.assert)(preTxid == txProof_1.TxProof.getTxIdFromPreimg1(backtraceInfo.preTx));
        (0, scrypt_ts_1.assert)(txProof_1.TxProof.mergeInput(backtraceInfo.preTxInput) ==
            backtraceInfo.preTx.inputs[Number(backtraceInfo.preTxInputIndex)]);
        (0, scrypt_ts_1.assert)(txUtil_1.TxUtil.checkIndex(backtraceInfo.preTxInput.outputIndexVal, backtraceInfo.preTxInput.outputIndex));
        (0, scrypt_ts_1.assert)(txProof_1.TxProof.getTxIdFromPreimg2(backtraceInfo.prePreTx) ==
            backtraceInfo.preTxInput.txhash);
        const prePreScript = backtraceInfo.prePreTx.outputScriptList[Number(backtraceInfo.preTxInput.outputIndexVal)];
        const backtraceGenesis = prePreScript == minterScript;
        // backtrace to token contract
        const backtraceToken = prePreScript == expectedScript;
        (0, scrypt_ts_1.assert)(backtraceGenesis || backtraceToken);
        return true;
    }
}
exports.Backtrace = Backtrace;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Boolean)
], Backtrace, "verifyUnique", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Boolean)
], Backtrace, "verifyToken", null);
//# sourceMappingURL=backtrace.js.map