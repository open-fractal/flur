/// <reference types="node" />
import BigInteger from 'bigi';
import { ContractTransaction } from 'scrypt-ts';
import { TxOutpoint } from '../contracts/utils/txUtil';
import { PrevoutsCtx, SHPreimage } from '../contracts/utils/sigHashUtils';
import { btc } from './btc';
export declare function getSigHashSchnorr(transaction: btc.Transaction, tapleafHash: Buffer, inputIndex?: number, sigHashType?: number): {
    preimage: Buffer;
    hash: Buffer;
};
export declare function getE(sighash: Buffer): BigInteger;
export declare function splitSighashPreimage(preimage: Buffer): {
    tapSighash1: Buffer;
    tapSighash2: Buffer;
    epoch: Buffer;
    sighashType: Buffer;
    txVersion: Buffer;
    nLockTime: Buffer;
    hashPrevouts: Buffer;
    hashSpentAmounts: Buffer;
    hashScripts: Buffer;
    hashSequences: Buffer;
    hashOutputs: Buffer;
    spendType: Buffer;
    inputNumber: Buffer;
    tapleafHash: Buffer;
    keyVersion: Buffer;
    codeseparatorPosition: Buffer;
};
export declare function toSHPreimageObj(preimageParts: any, _e: any, eLastByte: any): SHPreimage;
export declare const getPrevouts: (tx: btc.Transaction) => import("scrypt-ts").FixedArray<import("scrypt-ts").ByteString, 6>;
export declare const getPrevoutsIndex: (tx: btc.Transaction) => import("scrypt-ts").FixedArray<import("scrypt-ts").ByteString, 6>;
export declare const getSpentScripts: (tx: btc.Transaction) => import("scrypt-ts").FixedArray<import("scrypt-ts").ByteString, 6>;
export declare const getOutpointObj: (tx: btc.Transaction, index: number) => {
    txhash: string;
    outputIndex: string;
};
export declare const getOutpointString: (tx: btc.Transaction, index: number) => string;
export declare const checkDisableOpCode: (scriptPubKey: any) => boolean;
export declare const callToBufferList: (ct: ContractTransaction) => Buffer[];
export declare function getSHPreimage(tx: any, inputIndex: any, scriptBuffer: any): {
    SHPreimageObj: SHPreimage;
    sighash: {
        preimage: Buffer;
        hash: Buffer;
    };
};
export declare function getTxCtx(tx: any, inputIndex: any, scriptBuffer: any): {
    shPreimage: SHPreimage;
    prevoutsCtx: PrevoutsCtx;
    spentScripts: import("scrypt-ts").FixedArray<import("scrypt-ts").ByteString, 6>;
    sighash: {
        preimage: Buffer;
        hash: Buffer;
    };
};
export declare function toTxOutpoint(txid: string, outputIndex: number): TxOutpoint;
export declare function getSHPreimageMulti(tx: btc.Transaction, inputIndexList: number[], scriptBuffers: Buffer[]): Array<{
    SHPreimageObj: SHPreimage;
    sighash: {
        preimage: Buffer;
        hash: Buffer;
    };
}>;
export declare function getTxCtxMulti(tx: btc.Transaction, inputIndexList: number[], scriptBuffers: Buffer[]): {
    shPreimage: SHPreimage;
    prevoutsCtx: PrevoutsCtx;
    spentScripts: import("scrypt-ts").FixedArray<import("scrypt-ts").ByteString, 6>;
    sighash: {
        preimage: Buffer;
        hash: Buffer;
    };
}[];
//# sourceMappingURL=txTools.d.ts.map