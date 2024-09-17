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
exports.TxProof = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("./txUtil");
class TxProof extends scrypt_ts_1.SmartContractLib {
    static getTxIdFromPreimg1(preimage) {
        let txHex = preimage.version + preimage.inputCount;
        for (let i = 0; i < txUtil_1.MAX_INPUT; i++) {
            txHex += preimage.inputs[i];
        }
        txHex += preimage.outputCount;
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.int2ByteString)(preimage.outputCountVal) == preimage.outputCount);
        for (let i = 0; i < txUtil_1.MAX_OUTPUT; i++) {
            const outputSatoshi = preimage.outputSatoshisList[i];
            const outputScript = preimage.outputScriptList[i];
            const outputScriptLen = (0, scrypt_ts_1.int2ByteString)((0, scrypt_ts_1.len)(outputScript));
            if (i < preimage.outputCountVal) {
                txHex += outputSatoshi + outputScriptLen + outputScript;
            }
        }
        return (0, scrypt_ts_1.hash256)(txHex + preimage.nLocktime);
    }
    static getTxIdFromPreimg2(preimage) {
        let txHex = (0, scrypt_ts_1.toByteString)('');
        for (let i = 0; i < txUtil_1.XRAYED_TXID_PREIMG2_PREVLIST_LEN; i++) {
            txHex += preimage.prevList[i];
        }
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.int2ByteString)(preimage.outputCountVal) == preimage.outputCount);
        for (let i = 0; i < txUtil_1.MAX_OUTPUT; i++) {
            const outputSatoshi = preimage.outputSatoshisList[i];
            const outputScript = preimage.outputScriptList[i];
            const outputScriptLen = (0, scrypt_ts_1.int2ByteString)((0, scrypt_ts_1.len)(outputScript));
            if (i < preimage.outputCountVal) {
                txHex += outputSatoshi + outputScriptLen + outputScript;
            }
        }
        return (0, scrypt_ts_1.hash256)(txHex + preimage.nLocktime);
    }
    static getTxIdFromPreimg3(preimage) {
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.int2ByteString)(preimage.outputCountVal) == preimage.outputCount);
        let outputs = (0, scrypt_ts_1.toByteString)('');
        for (let i = 0; i < txUtil_1.XRAYED_TXID_PREIMG3_OUTPUT_NUMBER; i++) {
            const outputSatoshis = preimage.outputSatoshisList[i];
            const outputScript = preimage.outputScriptList[i];
            const outputScriptLen = (0, scrypt_ts_1.int2ByteString)((0, scrypt_ts_1.len)(outputScript));
            if (i < preimage.outputCountVal) {
                outputs += outputSatoshis + outputScriptLen + outputScript;
            }
        }
        return (0, scrypt_ts_1.hash256)(preimage.prev + outputs + preimage.nLocktime);
    }
    static mergeInput(txInput) {
        return (txInput.txhash +
            txInput.outputIndex +
            (0, scrypt_ts_1.toByteString)('00') +
            txInput.sequence);
    }
    static verifyOutput(preimage, txhash, outputIndexVal, outputScript) {
        (0, scrypt_ts_1.assert)(TxProof.getTxIdFromPreimg2(preimage) == txhash);
        (0, scrypt_ts_1.assert)(preimage.outputScriptList[Number(outputIndexVal)] == outputScript);
        return true;
    }
}
exports.TxProof = TxProof;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxProof, "getTxIdFromPreimg1", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxProof, "getTxIdFromPreimg2", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxProof, "getTxIdFromPreimg3", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxProof, "mergeInput", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, BigInt, String]),
    __metadata("design:returntype", Boolean)
], TxProof, "verifyOutput", null);
//# sourceMappingURL=txProof.js.map