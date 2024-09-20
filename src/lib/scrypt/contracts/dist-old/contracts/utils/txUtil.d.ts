import { ByteString, SmartContractLib, FixedArray } from 'scrypt-ts';
import { SpentScriptsCtx } from './sigHashUtils';
export type int32 = bigint;
export declare const Int32: BigIntConstructor;
export type TxOutpoint = {
    txhash: ByteString;
    outputIndex: ByteString;
};
export type LockingScriptParts = {
    code: ByteString;
    data: ByteString;
};
export type OpPushData = {
    len: int32;
    value: int32;
};
export type VarIntData = {
    len: int32;
    value: int32;
};
export type ChangeInfo = {
    script: ByteString;
    satoshis: ByteString;
};
export declare const MAX_INPUT = 6;
export declare const MAX_OUTPUT = 6;
export declare const MAX_TOKEN_INPUT = 5;
export declare const MAX_TOKEN_OUTPUT = 5;
export declare const MAX_STATE = 5;
export declare const ADDRESS_HASH_LEN = 20n;
export declare const STATE_OUTPUT_INDEX = 0;
export declare const STATE_OUTPUT_OFFSET = 1;
export declare const MAX_OUTPUT_SCRIPT_LEN = 34;
export declare const XRAYED_TXID_PREIMG2_PREVLIST_LEN = 4;
export declare const XRAYED_TXID_PREIMG3_OUTPUT_NUMBER = 4;
export declare class TxUtil extends SmartContractLib {
    static readonly ZEROSAT: ByteString;
    static mergePrevouts(prevouts: FixedArray<ByteString, typeof MAX_INPUT>): ByteString;
    static mergeSpentScripts(spentScripts: SpentScriptsCtx): ByteString;
    static buildOutput(script: ByteString, satoshis: ByteString): ByteString;
    static checkIndex(indexVal: int32, index: ByteString): boolean;
    static buildOpReturnRoot(script: ByteString): ByteString;
    static getStateScript(hashRoot: ByteString): ByteString;
    static getChangeOutput(changeInfo: ChangeInfo): ByteString;
}
//# sourceMappingURL=txUtil.d.ts.map