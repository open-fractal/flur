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
exports.OpenMinterProto = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
class OpenMinterProto extends scrypt_ts_1.SmartContractLib {
    static stateHash(_state) {
        const isPreminedByte = _state.isPremined
            ? (0, scrypt_ts_1.toByteString)('01')
            : (0, scrypt_ts_1.toByteString)('00');
        return (0, scrypt_ts_1.hash160)(_state.tokenScript +
            isPreminedByte +
            (0, scrypt_ts_1.int2ByteString)(_state.remainingSupply));
    }
    static create(tokenScript, isPremined, remainingSupply) {
        return {
            tokenScript: tokenScript,
            isPremined: isPremined,
            remainingSupply: remainingSupply,
        };
    }
    static toByteString(_state) {
        const isPreminedByte = _state.isPremined
            ? (0, scrypt_ts_1.toByteString)('01')
            : (0, scrypt_ts_1.toByteString)('00');
        return (_state.tokenScript +
            isPreminedByte +
            (0, scrypt_ts_1.int2ByteString)(_state.remainingSupply));
    }
    static getSplitAmountList(preMax, mintAmount, limit, splitMinterNumber) {
        const splitAmount = (0, scrypt_ts_1.fill)(0n, 2);
        if (splitMinterNumber > 0 && splitMinterNumber <= 2) {
            const totalSplit = preMax - mintAmount;
            const scale = (0, txUtil_1.Int32)(splitMinterNumber) * limit;
            const perMinterNumber = (totalSplit / scale) * limit;
            const delta = totalSplit - perMinterNumber * (0, txUtil_1.Int32)(splitMinterNumber);
            splitAmount[0] = perMinterNumber + delta;
            for (let i = 1; i < splitMinterNumber; i++) {
                splitAmount[i] = perMinterNumber;
            }
        }
        return splitAmount;
    }
}
exports.OpenMinterProto = OpenMinterProto;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], OpenMinterProto, "stateHash", null);
//# sourceMappingURL=openMinterProto.js.map