import { FixedArray } from 'scrypt-ts';
import { MAX_INPUT, MAX_TOKEN_OUTPUT } from '../contracts/utils/txUtil';
import { TxIdPreimg, XrayedTxIdPreimg1, XrayedTxIdPreimg2, XrayedTxIdPreimg3 } from '../contracts/utils/txProof';
import { BacktraceInfo } from '../contracts/utils/backtrace';
export declare const emptyFixedArray: () => FixedArray<import("scrypt-ts").ByteString, 6>;
export declare const emptyTokenArray: () => FixedArray<import("scrypt-ts").ByteString, 5>;
export declare const emptyBigIntArray: () => FixedArray<bigint, 6>;
export declare const emptyTokenAmountArray: () => FixedArray<bigint, 5>;
export declare const intArrayToByteString: (array: FixedArray<bigint, typeof MAX_INPUT>) => FixedArray<import("scrypt-ts").ByteString, 6>;
export declare const tokenAmountToByteString: (array: FixedArray<bigint, typeof MAX_TOKEN_OUTPUT>) => FixedArray<import("scrypt-ts").ByteString, 5>;
export declare const txToTxHeader: (tx: any) => TxIdPreimg;
export declare const txToTxHeaderPartial: (txHeader: TxIdPreimg) => XrayedTxIdPreimg1;
export declare const txToTxHeaderTiny: (txHeader: TxIdPreimg) => XrayedTxIdPreimg2;
export declare const txToTxHeaderCheck: (txHeader: TxIdPreimg) => XrayedTxIdPreimg3;
export declare const getTxHeaderCheck: (tx: any, outputIndex: number) => {
    tx: XrayedTxIdPreimg3;
    outputBytes: string;
    outputIndex: bigint;
    outputPre: string;
};
export declare const getBackTraceInfo: (preTx: any, prePreTx: any, inputIndex: number) => BacktraceInfo;
export declare const getBackTraceInfoSearch: (preTx: any, prePreTx: any, script: string, minterScript?: string) => BacktraceInfo;
//# sourceMappingURL=proof.d.ts.map