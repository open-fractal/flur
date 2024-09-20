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
exports.OpenMinterV2Proto = void 0;
const scrypt_ts_1 = require("scrypt-ts");
class OpenMinterV2Proto extends scrypt_ts_1.SmartContractLib {
    static stateHash(_state) {
        const isPreminedByte = _state.isPremined
            ? (0, scrypt_ts_1.toByteString)('01')
            : (0, scrypt_ts_1.toByteString)('00');
        return (0, scrypt_ts_1.hash160)(_state.tokenScript +
            isPreminedByte +
            (0, scrypt_ts_1.int2ByteString)(_state.remainingSupplyCount));
    }
    static create(tokenScript, isPremined, remainingSupply) {
        return {
            tokenScript: tokenScript,
            isPremined: isPremined,
            remainingSupplyCount: remainingSupply,
        };
    }
    static toByteString(_state) {
        const isPreminedByte = _state.isPremined
            ? (0, scrypt_ts_1.toByteString)('01')
            : (0, scrypt_ts_1.toByteString)('00');
        return (_state.tokenScript +
            isPreminedByte +
            (0, scrypt_ts_1.int2ByteString)(_state.remainingSupplyCount));
    }
    static getSplitAmountList(preRemainingSupply, isPremined, premineAmount) {
        let nextSupply = preRemainingSupply - 1n;
        if (!isPremined && premineAmount > 0n) {
            nextSupply = preRemainingSupply;
        }
        const splitAmount = (0, scrypt_ts_1.fill)(nextSupply / 2n, 2);
        splitAmount[0] += nextSupply - splitAmount[0] * 2n;
        return splitAmount;
    }
}
exports.OpenMinterV2Proto = OpenMinterV2Proto;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], OpenMinterV2Proto, "stateHash", null);
//# sourceMappingURL=openMinterV2Proto.js.map