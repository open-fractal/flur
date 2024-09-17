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
exports.ClosedMinter = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const backtrace_1 = require("../utils/backtrace");
const closedMinterProto_1 = require("./closedMinterProto");
const stateUtils_1 = require("../utils/stateUtils");
const cat20Proto_1 = require("./cat20Proto");
class ClosedMinter extends scrypt_ts_1.SmartContract {
    constructor(ownerAddress, genesisOutpoint) {
        super(...arguments);
        this.issuerAddress = ownerAddress;
        this.genesisOutpoint = genesisOutpoint;
    }
    mint(curTxoStateHashes, 
    // contrat logic args
    tokenMint, issuerPubKeyPrefix, issuerPubKey, issuerSig, 
    // contract lock satoshis
    genesisSatoshis, tokenSatoshis, 
    // verify preTx data part
    preState, preTxStatesInfo, 
    // backtrace
    backtraceInfo, 
    // common args
    // current tx info
    shPreimage, prevoutsCtx, spentScripts, 
    // change output info
    changeInfo) {
        // check preimage
        (0, scrypt_ts_1.assert)(this.checkSig(sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage), sigHashUtils_1.SigHashUtils.Gx), 'preimage check error');
        // check ctx
        sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
        sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScripts, shPreimage.hashSpentScripts);
        // verify state
        stateUtils_1.StateUtils.verifyPreStateHash(preTxStatesInfo, closedMinterProto_1.ClosedMinterProto.stateHash(preState), backtraceInfo.preTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], prevoutsCtx.outputIndexVal);
        // check preTx script eq this locking script
        const preScript = spentScripts[Number(prevoutsCtx.inputIndexVal)];
        // back to genesis
        backtrace_1.Backtrace.verifyUnique(prevoutsCtx.spentTxhash, backtraceInfo, this.genesisOutpoint, preScript);
        let hashString = (0, scrypt_ts_1.toByteString)('');
        let genesisOutput = (0, scrypt_ts_1.toByteString)('');
        let stateNumber = 0n;
        if (genesisSatoshis != txUtil_1.TxUtil.ZEROSAT) {
            genesisOutput = txUtil_1.TxUtil.buildOutput(preScript, genesisSatoshis);
            hashString += (0, scrypt_ts_1.hash160)(preTxStatesInfo.txoStateHashes[Number(prevoutsCtx.outputIndexVal) - txUtil_1.STATE_OUTPUT_OFFSET]);
            stateNumber += 1n;
        }
        hashString += (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
            amount: tokenMint.amount,
            ownerAddr: tokenMint.ownerAddr,
        }));
        const tokenOutput = txUtil_1.TxUtil.buildOutput(preState.tokenScript, tokenSatoshis);
        stateNumber += 1n;
        const stateOutput = stateUtils_1.StateUtils.getCurrentStateOutput(hashString, stateNumber, curTxoStateHashes);
        const changeOutput = txUtil_1.TxUtil.getChangeOutput(changeInfo);
        const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput + genesisOutput + tokenOutput + changeOutput);
        (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
        // check sig
        (0, scrypt_ts_1.assert)(this.issuerAddress == (0, scrypt_ts_1.hash160)(issuerPubKeyPrefix + issuerPubKey));
        (0, scrypt_ts_1.assert)(this.checkSig(issuerSig, issuerPubKey));
    }
}
exports.ClosedMinter = ClosedMinter;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], ClosedMinter.prototype, "issuerAddress", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], ClosedMinter.prototype, "genesisOutpoint", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ClosedMinter.prototype, "mint", null);
//# sourceMappingURL=closedMinter.js.map