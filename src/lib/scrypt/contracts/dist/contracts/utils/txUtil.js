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
exports.TxUtil = exports.XRAYED_TXID_PREIMG3_OUTPUT_NUMBER = exports.XRAYED_TXID_PREIMG2_PREVLIST_LEN = exports.MAX_OUTPUT_SCRIPT_LEN = exports.STATE_OUTPUT_OFFSET = exports.STATE_OUTPUT_INDEX = exports.ADDRESS_HASH_LEN = exports.MAX_STATE = exports.MAX_TOKEN_OUTPUT = exports.MAX_TOKEN_INPUT = exports.MAX_OUTPUT = exports.MAX_INPUT = exports.Int32 = void 0;
const scrypt_ts_1 = require("scrypt-ts");
exports.Int32 = BigInt;
/*
Because of bvm stack max element size is 520, witness tx calculate txid data need less than 520.
so max input number is 6, and output number is 6.
version 4
inputNumber 1
input (32 + 4 + 1 + 4) * inputNumber
outputNumber 1
output (8 + 1 + 34(p2tr script size)) * outputNumber
nLocktime 4
(520 - (4 + 1 + 1 + 4)) / (41 + 43) = 6.07
*/
// tx max input number
exports.MAX_INPUT = 6;
// tx max ouput number
exports.MAX_OUTPUT = 6;
// tx max token input number
exports.MAX_TOKEN_INPUT = 5;
// tx max token output number
exports.MAX_TOKEN_OUTPUT = 5;
// tx max stated output number, same as token output number
exports.MAX_STATE = 5;
// cat20 address len
exports.ADDRESS_HASH_LEN = 20n;
// state output index
exports.STATE_OUTPUT_INDEX = 0;
// other output start from 1
exports.STATE_OUTPUT_OFFSET = 1;
// max output script len, p2tr = 34
exports.MAX_OUTPUT_SCRIPT_LEN = 34;
// txid preimg2 prelist length is 4
exports.XRAYED_TXID_PREIMG2_PREVLIST_LEN = 4;
// txid preimg3 output length is 4
exports.XRAYED_TXID_PREIMG3_OUTPUT_NUMBER = 4;
class TxUtil extends scrypt_ts_1.SmartContractLib {
    static mergePrevouts(prevouts) {
        let result = (0, scrypt_ts_1.toByteString)('');
        for (let index = 0; index < exports.MAX_INPUT; index++) {
            const prevout = prevouts[index];
            result += prevout;
        }
        return result;
    }
    static mergeSpentScripts(spentScripts) {
        let result = (0, scrypt_ts_1.toByteString)('');
        for (let index = 0; index < exports.MAX_INPUT; index++) {
            const spentScript = spentScripts[index];
            result += (0, scrypt_ts_1.int2ByteString)((0, scrypt_ts_1.len)(spentScript)) + spentScript;
        }
        return result;
    }
    static buildOutput(script, satoshis) {
        const nlen = (0, scrypt_ts_1.len)(script);
        (0, scrypt_ts_1.assert)(nlen <= exports.MAX_OUTPUT_SCRIPT_LEN);
        return satoshis + (0, scrypt_ts_1.int2ByteString)(nlen) + script;
    }
    static checkIndex(indexVal, index) {
        let indexByte = (0, scrypt_ts_1.int2ByteString)(indexVal);
        if (indexByte == (0, scrypt_ts_1.toByteString)('')) {
            indexByte = (0, scrypt_ts_1.toByteString)('00');
        }
        return indexByte + (0, scrypt_ts_1.toByteString)('000000') == index;
    }
    static buildOpReturnRoot(script) {
        return ((0, scrypt_ts_1.toByteString)('0000000000000000') +
            (0, scrypt_ts_1.int2ByteString)((0, scrypt_ts_1.len)(script)) +
            script);
    }
    static getStateScript(hashRoot) {
        // op_return + 24 + cat + version(01) + hashroot
        return (0, scrypt_ts_1.toByteString)('6a1863617401') + hashRoot;
    }
    static getChangeOutput(changeInfo) {
        return changeInfo.satoshis != TxUtil.ZEROSAT
            ? TxUtil.buildOutput(changeInfo.script, changeInfo.satoshis)
            : (0, scrypt_ts_1.toByteString)('');
    }
}
exports.TxUtil = TxUtil;
TxUtil.ZEROSAT = (0, scrypt_ts_1.toByteString)('0000000000000000');
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], TxUtil, "ZEROSAT", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxUtil, "mergePrevouts", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxUtil, "mergeSpentScripts", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", String)
], TxUtil, "buildOutput", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt, String]),
    __metadata("design:returntype", Boolean)
], TxUtil, "checkIndex", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], TxUtil, "buildOpReturnRoot", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], TxUtil, "getStateScript", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], TxUtil, "getChangeOutput", null);
//# sourceMappingURL=txUtil.js.map