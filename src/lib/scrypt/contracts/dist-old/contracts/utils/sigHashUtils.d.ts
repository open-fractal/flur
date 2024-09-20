import { ByteString, FixedArray, PubKey, Sig, SmartContractLib } from 'scrypt-ts';
import { MAX_INPUT, int32 } from './txUtil';
export type SHPreimage = {
    txVer: ByteString;
    nLockTime: ByteString;
    hashPrevouts: ByteString;
    hashSpentAmounts: ByteString;
    hashSpentScripts: ByteString;
    hashSequences: ByteString;
    hashOutputs: ByteString;
    spendType: ByteString;
    inputIndex: ByteString;
    hashTapLeaf: ByteString;
    keyVer: ByteString;
    codeSeparator: ByteString;
    _e: ByteString;
    eLastByte: int32;
};
export type PrevoutsCtx = {
    prevouts: FixedArray<ByteString, typeof MAX_INPUT>;
    inputIndexVal: int32;
    outputIndexVal: int32;
    spentTxhash: ByteString;
    outputIndex: ByteString;
};
export type SpentScriptsCtx = FixedArray<ByteString, typeof MAX_INPUT>;
export declare class SigHashUtils extends SmartContractLib {
    static readonly Gx: PubKey;
    static readonly ePreimagePrefix: ByteString;
    static readonly preimagePrefix: ByteString;
    static checkSHPreimage(shPreimage: SHPreimage): Sig;
    static checkPrevoutsCtx(prevoutsCtx: PrevoutsCtx, hashPrevouts: ByteString, inputIndex: ByteString): boolean;
    static checkSpentScriptsCtx(spentScripts: SpentScriptsCtx, hashSpentScripts: ByteString): boolean;
}
//# sourceMappingURL=sigHashUtils.d.ts.map