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
exports.SellUtil = void 0;
const index_1 = require("../../index");
const scrypt_ts_1 = require("scrypt-ts");
class SellUtil extends scrypt_ts_1.SmartContractLib {
    static mergeSpentAmounts(spentAmounts) {
        let result = (0, scrypt_ts_1.toByteString)('');
        for (let index = 0; index < index_1.MAX_INPUT; index++) {
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
    static int32ToSatoshiBytesScaled(amount, scale) {
        (0, scrypt_ts_1.assert)(amount > 0n);
        let amountBytes = scale
            ? SellUtil.scale2ByteString(amount)
            : (0, scrypt_ts_1.int2ByteString)(amount);
        const amountBytesLen = (0, scrypt_ts_1.len)(amountBytes);
        if (amountBytesLen == 1n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('00000000000000');
        }
        else if (amountBytesLen == 2n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('000000000000');
        }
        else if (amountBytesLen == 3n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('0000000000');
        }
        else if (amountBytesLen == 4n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('00000000');
        }
        else if (amountBytesLen == 5n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('000000');
        }
        else if (amountBytesLen == 6n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('0000');
        }
        else if (amountBytesLen == 7n) {
            amountBytes += (0, scrypt_ts_1.toByteString)('00');
        }
        return amountBytes;
    }
    static scale2ByteString(amount) {
        return (0, scrypt_ts_1.toByteString)('00') + (0, scrypt_ts_1.int2ByteString)(amount);
    }
}
exports.SellUtil = SellUtil;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], SellUtil, "mergeSpentAmounts", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Boolean)
], SellUtil, "checkSpentAmountsCtx", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt]),
    __metadata("design:returntype", String)
], SellUtil, "int32ToSatoshiBytes", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt, Boolean]),
    __metadata("design:returntype", String)
], SellUtil, "int32ToSatoshiBytesScaled", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt]),
    __metadata("design:returntype", String)
], SellUtil, "scale2ByteString", null);
//# sourceMappingURL=sellUtil.js.map