"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellUtil = void 0;
const cat_smartcontracts_1 = require("@cat-protocol/cat-smartcontracts");
const scrypt_ts_1 = require("scrypt-ts");
class SellUtil extends scrypt_ts_1.SmartContractLib {
    static mergeSpentAmounts(spentAmounts) {
        let result = (0, scrypt_ts_1.toByteString)('');
        for (let index = 0; index < cat_smartcontracts_1.MAX_INPUT; index++) {
            const spentAmount = spentAmounts[index];
            if ((0, scrypt_ts_1.len)(spentAmount) == 8n) {
                result += spentAmount;
            }
        }
        return result;
    }
    static checkSpentAmountsCtx(spentAmounts, hashSpentAmounts) {
        // check spent amounts
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.sha256)(SellUtil.mergeSpentAmounts(spentAmounts)) ==
            hashSpentAmounts, 'spentAmountsCtx mismatch');
        return true;
    }
    static int32ToSatoshiBytes(amount) {
        (0, scrypt_ts_1.assert)(amount > 0n);
        let amountBytes = (0, scrypt_ts_1.int2ByteString)(amount);
        const amountBytesLen = (0, scrypt_ts_1.len)(amountBytes);
        if (amountBytesLen == 1n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('000000');
        }
        else if (amountBytesLen == 2n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('0000');
        }
        else if (amountBytesLen == 3n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('00');
        }
        return amountBytes + (0, scrypt_ts_1.toByteString)('00000000');
    }
}
exports.SellUtil = SellUtil;
__decorate([
    (0, scrypt_ts_1.method)()
], SellUtil, "mergeSpentAmounts", null);
__decorate([
    (0, scrypt_ts_1.method)()
], SellUtil, "checkSpentAmountsCtx", null);
__decorate([
    (0, scrypt_ts_1.method)()
], SellUtil, "int32ToSatoshiBytes", null);
//# sourceMappingURL=sellUtil.js.map