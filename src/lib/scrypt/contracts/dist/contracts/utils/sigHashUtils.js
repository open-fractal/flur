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
exports.SigHashUtils = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("./txUtil");
class SigHashUtils extends scrypt_ts_1.SmartContractLib {
    static checkSHPreimage(shPreimage) {
        const sigHash = (0, scrypt_ts_1.sha256)(SigHashUtils.preimagePrefix +
            shPreimage.txVer +
            shPreimage.nLockTime +
            shPreimage.hashPrevouts +
            shPreimage.hashSpentAmounts +
            shPreimage.hashSpentScripts +
            shPreimage.hashSequences +
            shPreimage.hashOutputs +
            shPreimage.spendType +
            shPreimage.inputIndex +
            shPreimage.hashTapLeaf +
            shPreimage.keyVer +
            shPreimage.codeSeparator);
        const e = (0, scrypt_ts_1.sha256)(SigHashUtils.ePreimagePrefix + sigHash);
        (0, scrypt_ts_1.assert)(shPreimage.eLastByte < 127n, 'invalid value of _e');
        const eLastByte = shPreimage.eLastByte == 0n
            ? (0, scrypt_ts_1.toByteString)('00')
            : (0, scrypt_ts_1.int2ByteString)(shPreimage.eLastByte);
        (0, scrypt_ts_1.assert)(e == shPreimage._e + eLastByte, 'invalid value of _e');
        const s = SigHashUtils.Gx +
            shPreimage._e +
            (0, scrypt_ts_1.int2ByteString)(shPreimage.eLastByte + 1n);
        //assert(this.checkSig(Sig(s), SigHashUtils.Gx)) TODO (currently done outside)
        return (0, scrypt_ts_1.Sig)(s);
    }
    static checkPrevoutsCtx(prevoutsCtx, hashPrevouts, inputIndex) {
        // check prevouts
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.sha256)(txUtil_1.TxUtil.mergePrevouts(prevoutsCtx.prevouts)) == hashPrevouts, 'hashPrevouts mismatch');
        // check input index
        (0, scrypt_ts_1.assert)(txUtil_1.TxUtil.checkIndex(prevoutsCtx.inputIndexVal, inputIndex));
        // check vout
        (0, scrypt_ts_1.assert)(txUtil_1.TxUtil.checkIndex(prevoutsCtx.outputIndexVal, prevoutsCtx.outputIndex));
        // check prevout
        (0, scrypt_ts_1.assert)(prevoutsCtx.prevouts[Number(prevoutsCtx.inputIndexVal)] ==
            prevoutsCtx.spentTxhash + prevoutsCtx.outputIndex
        // 'input outpoint mismatch'
        );
        return true;
    }
    static checkSpentScriptsCtx(spentScripts, hashSpentScripts) {
        // check spent scripts
        (0, scrypt_ts_1.assert)((0, scrypt_ts_1.sha256)(txUtil_1.TxUtil.mergeSpentScripts(spentScripts)) == hashSpentScripts, 'hashSpentScripts mismatch');
        return true;
    }
}
exports.SigHashUtils = SigHashUtils;
// Data for checking sighash preimage:
SigHashUtils.Gx = (0, scrypt_ts_1.PubKey)((0, scrypt_ts_1.toByteString)('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'));
SigHashUtils.ePreimagePrefix = (0, scrypt_ts_1.toByteString)('7bb52d7a9fef58323eb1bf7a407db382d2f3f2d81bb1224f49fe518f6d48d37c7bb52d7a9fef58323eb1bf7a407db382d2f3f2d81bb1224f49fe518f6d48d37c79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f8179879be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'); // TAG_HASH + TAG_HASH + Gx + Gx
SigHashUtils.preimagePrefix = (0, scrypt_ts_1.toByteString)('f40a48df4b2a70c8b4924bf2654661ed3d95fd66a313eb87237597c628e4a031f40a48df4b2a70c8b4924bf2654661ed3d95fd66a313eb87237597c628e4a0310000'); // TAPSIGHASH + TAPSIGHASH + PREIMAGE_SIGHASH + PREIMAGE_EPOCH
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], SigHashUtils, "Gx", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], SigHashUtils, "ePreimagePrefix", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], SigHashUtils, "preimagePrefix", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], SigHashUtils, "checkSHPreimage", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Boolean)
], SigHashUtils, "checkPrevoutsCtx", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Boolean)
], SigHashUtils, "checkSpentScriptsCtx", null);
//# sourceMappingURL=sigHashUtils.js.map