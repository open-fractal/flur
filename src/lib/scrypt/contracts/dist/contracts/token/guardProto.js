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
exports.GuardProto = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const proof_1 = require("../../lib/proof");
const txUtil_1 = require("../utils/txUtil");
class GuardProto extends scrypt_ts_1.SmartContractLib {
    static stateHash(_state) {
        let inputOutpointAll = _state.tokenScript;
        for (let i = 0; i < txUtil_1.MAX_INPUT; i++) {
            inputOutpointAll += (0, scrypt_ts_1.int2ByteString)(_state.inputTokenAmountArray[i]);
        }
        return (0, scrypt_ts_1.hash160)(inputOutpointAll);
    }
    static toByteString(state) {
        return GuardProto.toList(state).join('');
    }
    static createEmptyState() {
        return {
            tokenScript: (0, scrypt_ts_1.toByteString)(''),
            inputTokenAmountArray: (0, proof_1.emptyBigIntArray)(),
        };
    }
    static toList(state) {
        const dataList = [
            state.tokenScript,
            ...(0, proof_1.intArrayToByteString)(state.inputTokenAmountArray),
        ];
        return dataList;
    }
}
exports.GuardProto = GuardProto;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], GuardProto, "stateHash", null);
//# sourceMappingURL=guardProto.js.map