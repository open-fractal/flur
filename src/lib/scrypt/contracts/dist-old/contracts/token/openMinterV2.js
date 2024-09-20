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
exports.OpenMinterV2 = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const backtrace_1 = require("../utils/backtrace");
const stateUtils_1 = require("../utils/stateUtils");
const cat20Proto_1 = require("./cat20Proto");
const openMinterV2Proto_1 = require("./openMinterV2Proto");
const MAX_NEXT_MINTERS = 2;
class OpenMinterV2 extends scrypt_ts_1.SmartContract {
    constructor(genesisOutpoint, maxCount, premine, premineCount, limit, premineAddr) {
        super(...arguments);
        this.genesisOutpoint = genesisOutpoint;
        this.maxCount = maxCount;
        /*
        Note: this assumes this.premineCount *  this.limit  == this.premine,
        which can be trivially validated by anyone after the token is deployed
        */
        this.premine = premine;
        this.premineCount = premineCount;
        this.limit = limit;
        this.premineAddr = premineAddr;
    }
    mint(
    //
    curTxoStateHashes, 
    // contract logic args
    tokenMint, nextMinterCounts, 
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
        stateUtils_1.StateUtils.verifyPreStateHash(preTxStatesInfo, openMinterV2Proto_1.OpenMinterV2Proto.stateHash(preState), backtraceInfo.preTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], prevoutsCtx.outputIndexVal);
        // check preTx script eq this locking script
        const preScript = spentScriptsCtx[Number(prevoutsCtx.inputIndexVal)];
        // back to genesis
        backtrace_1.Backtrace.verifyUnique(prevoutsCtx.spentTxhash, backtraceInfo, this.genesisOutpoint, preScript);
        // split to multiple minters
        let openMinterOutputs = (0, scrypt_ts_1.toByteString)('');
        let curStateHashes = (0, scrypt_ts_1.toByteString)('');
        let curStateCnt = 1n;
        let mintCount = 0n;
        for (let i = 0; i < MAX_NEXT_MINTERS; i++) {
            const count = nextMinterCounts[i];
            if (count > 0n) {
                mintCount += count;
                curStateCnt += 1n;
                openMinterOutputs += txUtil_1.TxUtil.buildOutput(preScript, minterSatoshis);
                curStateHashes += (0, scrypt_ts_1.hash160)(openMinterV2Proto_1.OpenMinterV2Proto.stateHash({
                    tokenScript: preState.tokenScript,
                    isPremined: true,
                    remainingSupplyCount: count,
                }));
            }
        }
        // mint token
        curStateHashes += (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
            amount: tokenMint.amount,
            ownerAddr: tokenMint.ownerAddr,
        }));
        const tokenOutput = txUtil_1.TxUtil.buildOutput(preState.tokenScript, tokenSatoshis);
        if (!preState.isPremined && this.premine > 0n) {
            // premine need checksig
            (0, scrypt_ts_1.assert)((0, scrypt_ts_1.hash160)(preminerPubKeyPrefix + preminerPubKey) ==
                this.premineAddr);
            (0, scrypt_ts_1.assert)(this.checkSig(preminerSig, preminerPubKey));
            // first unlock mint
            (0, scrypt_ts_1.assert)(mintCount == preState.remainingSupplyCount);
            (0, scrypt_ts_1.assert)(this.maxCount ==
                preState.remainingSupplyCount + this.premineCount);
            (0, scrypt_ts_1.assert)(tokenMint.amount == this.premine);
        }
        else {
            // not first unlock mint
            mintCount += 1n;
            (0, scrypt_ts_1.assert)(mintCount == preState.remainingSupplyCount);
            (0, scrypt_ts_1.assert)(tokenMint.amount == this.limit);
        }
        const stateOutput = stateUtils_1.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
        const changeOutput = txUtil_1.TxUtil.getChangeOutput(changeInfo);
        const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput + openMinterOutputs + tokenOutput + changeOutput);
        (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
    }
}
exports.OpenMinterV2 = OpenMinterV2;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], OpenMinterV2.prototype, "genesisOutpoint", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinterV2.prototype, "maxCount", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinterV2.prototype, "premine", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinterV2.prototype, "premineCount", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], OpenMinterV2.prototype, "limit", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], OpenMinterV2.prototype, "premineAddr", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, String, String, String, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], OpenMinterV2.prototype, "mint", null);
//# sourceMappingURL=openMinterV2.js.map