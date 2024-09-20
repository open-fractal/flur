import { ByteString, FixedArray, SmartContractLib } from 'scrypt-ts';
import { MAX_INPUT, MAX_OUTPUT, XRAYED_TXID_PREIMG2_PREVLIST_LEN, XRAYED_TXID_PREIMG3_OUTPUT_NUMBER, int32 } from './txUtil';
export type TxInput = {
    txhash: ByteString;
    outputIndex: ByteString;
    outputIndexVal: int32;
    sequence: ByteString;
};
export type TxIdPreimg = {
    version: ByteString;
    inputCount: ByteString;
    inputTxhashList: FixedArray<ByteString, typeof MAX_INPUT>;
    inputOutputIndexList: FixedArray<ByteString, typeof MAX_INPUT>;
    inputScriptList: FixedArray<ByteString, typeof MAX_INPUT>;
    inputSequenceList: FixedArray<ByteString, typeof MAX_INPUT>;
    outputCount: ByteString;
    outputSatoshisList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    outputScriptLenList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    outputScriptList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    nLocktime: ByteString;
};
export type XrayedTxIdPreimg1 = {
    version: ByteString;
    inputCount: ByteString;
    inputs: FixedArray<ByteString, typeof MAX_INPUT>;
    outputCountVal: int32;
    outputCount: ByteString;
    outputSatoshisList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    outputScriptList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    nLocktime: ByteString;
};
export type XrayedTxIdPreimg2 = {
    prevList: FixedArray<ByteString, typeof XRAYED_TXID_PREIMG2_PREVLIST_LEN>;
    outputCountVal: int32;
    outputCount: ByteString;
    outputSatoshisList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    outputScriptList: FixedArray<ByteString, typeof MAX_OUTPUT>;
    nLocktime: ByteString;
};
export type XrayedTxIdPreimg3 = {
    prev: ByteString;
    outputCountVal: int32;
    outputCount: ByteString;
    outputSatoshisList: FixedArray<ByteString, typeof XRAYED_TXID_PREIMG3_OUTPUT_NUMBER>;
    outputScriptList: FixedArray<ByteString, typeof XRAYED_TXID_PREIMG3_OUTPUT_NUMBER>;
    nLocktime: ByteString;
};
export declare class TxProof extends SmartContractLib {
    static getTxIdFromPreimg1(preimage: XrayedTxIdPreimg1): ByteString;
    static getTxIdFromPreimg2(preimage: XrayedTxIdPreimg2): ByteString;
    static getTxIdFromPreimg3(preimage: XrayedTxIdPreimg3): ByteString;
    static mergeInput(txInput: TxInput): ByteString;
    static verifyOutput(preimage: XrayedTxIdPreimg2, txhash: ByteString, outputIndexVal: int32, outputScript: ByteString): boolean;
}
//# sourceMappingURL=txProof.d.ts.map