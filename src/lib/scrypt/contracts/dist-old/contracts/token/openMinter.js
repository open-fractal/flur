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
exports.OpenMinter = exports.MAX_NEXT_MINTERS = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const backtrace_1 = require("../utils/backtrace");
const stateUtils_1 = require("../utils/stateUtils");
const cat20Proto_1 = require("./cat20Proto");
const openMinterProto_1 = require("./openMinterProto");
exports.MAX_NEXT_MINTERS = 2;
class OpenMinter extends scrypt_ts_1.SmartContract {
    constructor(genesisOutpoint, max, premine, limit, premineAddr) {
        super(...arguments);
        this.genesisOutpoint = genesisOutpoint;
        this.max = max;
        this.premine = premine;
        this.limit = limit;
        this.premineAddr = premineAddr;
    }
    mint(
    //
    curTxoStateHashes, 
    // contract logic args
    tokenMint, nextMinterAmounts, 
    // premine related args
    preminerPubKeyPrefix, preminerPubKey, preminerSig, 
    // satoshis locked in minter utxo
    minterSatoshis, 
    // satoshis locked in token utxo
    tokenSatoshis, 
    // unlock utxo state info
    preState, preTxStatesInfo, 
    // backtrace info, use b2g
    backtraceInfo, 
    // common args
    // current tx info
    shPreimage, prevoutsCtx, spentScriptsCtx, 
    // change output info
    changeInfo) {
        // check preimage
        (0, scrypt_ts_1.assert)(this.checkSig(sigHashUtils_1.SigHashUtils.checkSHPreimage(shPreimage), sigHashUtils_1.SigHashUtils.Gx), 'preimage check error');
        // check ctx
        sigHashUtils_1.SigHashUtils.checkPrevoutsCtx(prevoutsCtx, shPreimage.hashPrevouts, shPreimage.inputIndex);
        sigHashUtils_1.SigHashUtils.checkSpentScriptsCtx(spentScriptsCtx, shPreimage.hashSpentScripts);
        // verify state
        stateUtils_1.StateUtils.verifyPreStateHash(preTxStatesInfo, openMinterProto_1.OpenMinterProto.stateHash(preState), backtraceInfo.preTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], prevoutsCtx.outputIndexVal);
        // check preTx script eq this locking script
        const preScript = spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)];
        // back to genesis
        backtrace_1.Backtrace.verifyUnique(prevoutsCtx.spentTxhash, backtraceInfo, this.genesisOutpoint, preScript);
        // split to multiple minters
        let openMinterOutputs = (0, scrypt_ts_1.toByteString)('');
        let curStateHashes = (0, scrypt_ts_1.toByteString)('');
        let curStateCnt = 0n;
        let totalAmount = 0n;
        for (let i = 0; i < exports.MAX_NEXT_MINTERS; i++) {
            const amount = nextMinterAmounts[i];
            if (amount > 0n) {
                totalAmount += amount;
                curStateCnt += 1n;
                openMinterOutputs += txUtil_1.TxUtil.buildOutput(preScript, minterSatoshis);
                curStateHashes += (0, scrypt_ts_1.hash160)(openMinterProto_1.OpenMinterProto.stateHash({
                    tokenScript: preState.tokenScript,
                    isPremined: true,
                    remainingSupply: amount,
                }));
            }
        }
        // mint token
        let tokenOutput = (0, scrypt_ts_1.toByteString)('');
        if (tokenMint.amount > 0n) {
            totalAmount += tokenMint.amount;
            curStateCnt += 1n;
            curStateHashes += (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
                amount: tokenMint.amount,
                ownerAddr: tokenMint.ownerAddr,
            }));
            tokenOutput = txUtil_1.TxUtil.buildOutput(preState.tokenScript, tokenSatoshis);
        }
        if (!preState.isPremined && this.premine > 0n) {
            // premine need checksig
            (0, scrypt_ts_1.assert)((0, scrypt_ts_1.hash160)(preminerPubKeyPrefix + preminerPubKey) ==
                this.premineAddr);
            (0, scrypt_ts_1.assert)(this.checkSig(preminerSig, preminerPubKey));
            // first unlock mint
            (0, scrypt_ts_1.assert)(totalAmount == preState.remainingSupply + this.premine);
            (0, scrypt_ts_1.assert)(this.max == preState.remainingSupply + this.premine);
            (0, scrypt_ts_1.assert)(tokenMint.amount == this.premine);
        }
        else {
            // not first unlock mint
            (0, scrypt_ts_1.assert)(totalAmount == preState.remainingSupply);
            (0, scrypt_ts_1.assert)(tokenMint.amount <= this.limit);
        }
        const stateOutput = stateUtils_1.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
        const changeOutput = txUtil_1.TxUtil.getChangeOutput(changeInfo);
        const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput + openMinterOutputs + tokenOutput + changeOutput);
        (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
    }
}
exports.OpenMinter = OpenMinter;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], OpenMinter.prototype, "genesisOutpoint", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinter.prototype, "max", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinter.prototype, "premine", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinter.prototype, "limit", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], OpenMinter.prototype, "premineAddr", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, String, String, String, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], OpenMinter.prototype, "mint", null);
//# sourceMappingURL=openMinter.js.map