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
exports.CAT20Proto = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
class CAT20Proto extends scrypt_ts_1.SmartContractLib {
    static stateHash(_state) {
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.len)(_state.ownerAddr) == txUtil_1.ADDRESS_HASH_LEN);
        return (0, scrypt_ts_1.hash160)(_state.ownerAddr + (0, scrypt_ts_1.int2ByteString)(_state.amount));
    }
    static create(amount, address) {
        return {
            amount,
            ownerAddr: address,
        };
    }
    static toByteString(tokenInfo) {
        return tokenInfo.ownerAddr + (0, scrypt_ts_1.int2ByteString)(tokenInfo.amount);
    }
}
exports.CAT20Proto = CAT20Proto;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], CAT20Proto, "stateHash", null);
//# sourceMappingURL=cat20Proto.js.map