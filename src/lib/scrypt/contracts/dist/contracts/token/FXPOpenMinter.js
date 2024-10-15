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
exports.FXPOpenMinter = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../utils/txUtil");
const sigHashUtils_1 = require("../utils/sigHashUtils");
const backtrace_1 = require("../utils/backtrace");
const stateUtils_1 = require("../utils/stateUtils");
const cat20Proto_1 = require("./cat20Proto");
const openMinterV2Proto_1 = require("./openMinterV2Proto");
const txProof_1 = require("../utils/txProof");
const MAX_NEXT_MINTERS = 2;
class FXPOpenMinter extends scrypt_ts_1.SmartContract {
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
    static getFXPAmount(tx) {
        const hash = FXPOpenMinter.getFXPAmountHash(tx);
        let magnitude = (0, scrypt_ts_1.byteString2Int)(hash[0] + hash[1]);
        if (magnitude < 0n) {
            magnitude = -magnitude;
        }
        return magnitude;
    }
    static getFXPAmountHash(tx) {
        const hash = (0, scrypt_ts_1.sha256)(tx.outputScriptList[0] +
            tx.outputScriptList[1] +
            tx.outputScriptList[2] +
            tx.outputScriptList[3] +
            tx.outputScriptList[4] +
            tx.outputScriptList[5]);
        return hash;
    }
    mint(
    //
    curTxoStateHashes, 
    // contract logic args
    tokenMint, nextMinterCounts, 
    // FXP Guard
    guardPreTx, guardPreState, guardPreTxStatesInfo, guardAmountHashSuffix, guardTakerPubkey, 
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
        // Verify guard script
        const FXPSellGuardP2TR = (0, scrypt_ts_1.toByteString)('51204531afe938faf1565672605241a227e4484cb728bf74eadc231d341e5c310e81');
        const FXPBuyGuardP2TR = (0, scrypt_ts_1.toByteString)('5120629546ef6334959d5d9c0ab8268c3f04d23b56658c1f3ad34d94555a9f7db8b3');
        const takerScript = (0, scrypt_ts_1.toByteString)('5120') + guardTakerPubkey;
        const isBuy = spentScriptsCtx[1] == FXPBuyGuardP2TR;
        const isSell = spentScriptsCtx[1] == FXPSellGuardP2TR;
        const guardTxid = txProof_1.TxProof.getTxIdFromPreimg1(guardPreTx);
        (0, scrypt_ts_1.assert)(isBuy || isSell, 'guard script mismatches');
        (0, scrypt_ts_1.assert)(tokenMint.ownerAddr == guardPreState.ownerAddr, 'ownerAddr mismatch');
        if (isSell) {
            (0, scrypt_ts_1.assert)(takerScript == guardPreTx.outputScriptList[2], 'taker pubkey mismatch');
            (0, scrypt_ts_1.assert)(guardTxid + (0, scrypt_ts_1.toByteString)('04000000') ===
                prevoutsCtx.prevouts[1], 'guard txid mismatch');
        }
        if (isBuy) {
            const is5 = guardPreTx.outputScriptList[5] == takerScript;
            const is4 = guardPreTx.outputScriptList[4] == takerScript;
            (0, scrypt_ts_1.assert)(is5 || is4, 'taker pubkey mismatch');
            if (is4) {
                (0, scrypt_ts_1.assert)(guardTxid + (0, scrypt_ts_1.toByteString)('03000000') ===
                    prevoutsCtx.prevouts[1], 'guard txid mismatch');
            }
            if (is5) {
                (0, scrypt_ts_1.assert)(guardTxid + (0, scrypt_ts_1.toByteString)('04000000') ===
                    prevoutsCtx.prevouts[1], 'guard txid mismatch');
            }
        }
        // Verify guard state
        stateUtils_1.StateUtils.verifyPreStateHash(guardPreTxStatesInfo, cat20Proto_1.CAT20Proto.stateHash(guardPreState), guardPreTx.outputScriptList[txUtil_1.STATE_OUTPUT_INDEX], 1n);
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
        const tokenOutput = txUtil_1.TxUtil.buildOutput(preState.tokenScript, tokenSatoshis);
        const tokenOutputs = tokenOutput + tokenOutput;
        // Maker mint
        curStateHashes += (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
            amount: tokenMint.amount,
            ownerAddr: tokenMint.ownerAddr,
        }));
        // Taker mint
        curStateHashes += (0, scrypt_ts_1.hash160)(cat20Proto_1.CAT20Proto.stateHash({
            amount: tokenMint.amount,
            ownerAddr: (0, scrypt_ts_1.hash160)(guardTakerPubkey),
        }));
        curStateCnt += 1n;
        // not first unlock mint
        mintCount += 1n;
        (0, scrypt_ts_1.assert)(mintCount == preState.remainingSupplyCount);
        const amountHash = FXPOpenMinter.getFXPAmountHash(guardPreTx);
        const posAmountHash = (0, scrypt_ts_1.int2ByteString)(tokenMint.amount) + guardAmountHashSuffix;
        const negAmountHash = (0, scrypt_ts_1.int2ByteString)(-tokenMint.amount) + guardAmountHashSuffix;
        (0, scrypt_ts_1.assert)(amountHash == posAmountHash || amountHash == negAmountHash, 'FXP amount mismatch');
        const stateOutput = stateUtils_1.StateUtils.getCurrentStateOutput(curStateHashes, curStateCnt, curTxoStateHashes);
        const changeOutput = txUtil_1.TxUtil.getChangeOutput(changeInfo);
        const hashOutputs = (0, scrypt_ts_1.sha256)(stateOutput + openMinterOutputs + tokenOutputs + changeOutput);
        (0, scrypt_ts_1.assert)(hashOutputs == shPreimage.hashOutputs, 'hashOutputs mismatch');
    }
}
exports.FXPOpenMinter = FXPOpenMinter;
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], FXPOpenMinter.prototype, "genesisOutpoint", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], FXPOpenMinter.prototype, "maxCount", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], FXPOpenMinter.prototype, "premine", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], FXPOpenMinter.prototype, "premineCount", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", BigInt)
], FXPOpenMinter.prototype, "limit", void 0);
__decorate([
    (0, scrypt_ts_1.prop)(),
    __metadata("design:type", String)
], FXPOpenMinter.prototype, "premineAddr", void 0);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, String, String, String, String, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FXPOpenMinter.prototype, "mint", null);
__decorate([
    (0, scrypt_ts_1.method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], FXPOpenMinter, "getFXPAmountHash", null);
//# sourceMappingURL=FXPOpenMinter.js.map