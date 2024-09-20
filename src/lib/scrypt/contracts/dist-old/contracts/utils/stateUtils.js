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
exports.StateUtils = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("./txUtil");
const txProof_1 = require("./txProof");
class StateUtils extends scrypt_ts_1.SmartContractLib {
    static verifyStateRoot(txoStateHashes, statesHashRoot) {
        let rawString = (0, scrypt_ts_1.toByteString)('');
        for (let i = 0; i < txUtil_1.MAX_STATE; i++) {
            rawString += (0, scrypt_ts_1.hash160)(txoStateHashes[i]);
        }
        return (0, scrypt_ts_1.hash160)(rawString) == statesHashRoot;
    }
    static getPadding(stateNumber) {
        const number = BigInt(txUtil_1.MAX_STATE) - stateNumber;
        let padding = (0, scrypt_ts_1.toByteString)('');
        for (let index = 0; index < txUtil_1.MAX_STATE; index++) {
            if (index < number) {
                padding += (0, scrypt_ts_1.hash160)((0, scrypt_ts_1.toByteString)(''));
            }
        }
        return padding;
    }
    static getStateScript(hashString, stateNumber) {
        return txUtil_1.TxUtil.getStateScript((0, scrypt_ts_1.hash160)((0, scrypt_ts_1.hash160)(hashString) + StateUtils.getPadding(stateNumber)));
    }
    static getCurrentStateOutput(hashString, stateNumber, stateHashList) {
        const hashRoot = (0, scrypt_ts_1.hash160)(hashString + StateUtils.getPadding(stateNumber));
        (0, scrypt_ts_1.assert)(StateUtils.verifyStateRoot(stateHashList, hashRoot));
        return txUtil_1.TxUtil.buildOpReturnRoot(txUtil_1.TxUtil.getStateScript(hashRoot));
    }
    static verifyPreStateHash(statesInfo, preStateHash, preTxStateScript, outputIndex) {
        // verify preState
        (0, scrypt_ts_1.assert)(txUtil_1.TxUtil.getStateScript(statesInfo.statesHashRoot) ==
            preTxStateScript, 'preStateHashRoot mismatch');
        (0, scrypt_ts_1.assert)(StateUtils.verifyStateRoot(statesInfo.txoStateHashes, statesInfo.statesHashRoot), 'preData error');
        (0, scrypt_ts_1.assert)(preStateHash == statesInfo.txoStateHashes[Number(outputIndex - 1n)], 'preState hash mismatch');
        return true;
    }
    static verifyGuardStateHash(preTx, preTxhash, preStateHash) {
        (0, scrypt_ts_1.assert)(txProof_1.TxProof.getTxIdFromPreimg3(preTx) == preTxhash, 'preTxHeader error');
        (0, scrypt_ts_1.assert)(StateUtils.getStateScript(preStateHash, 1n) ==
            preTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], 'preStateHashRoot mismatch');
        return true;
    }
}
exports.StateUtils = StateUtils;
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Boolean)
], StateUtils, "verifyStateRoot", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BigInt]),
    __metadata("design:returntype", String)
], StateUtils, "getPadding", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, BigInt]),
    __metadata("design:returntype", String)
], StateUtils, "getStateScript", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, BigInt, Object]),
    __metadata("design:returntype", String)
], StateUtils, "getCurrentStateOutput", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, BigInt]),
    __metadata("design:returntype", Boolean)
], StateUtils, "verifyPreStateHash", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Boolean)
], StateUtils, "verifyGuardStateHash", null);
//# sourceMappingURL=stateUtils.js.map