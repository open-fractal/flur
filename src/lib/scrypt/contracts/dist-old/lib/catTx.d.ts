/// <reference types="node" />
import { ProtocolState } from './state';
import { ByteString, SmartContract } from 'scrypt-ts';
import { btc } from './btc';
export type ContractIns<T> = {
    catTx: CatTx;
    preCatTx?: CatTx;
    contract: SmartContract;
    contractTaproot: TaprootSmartContract;
    state: T;
    atOutputIndex: number;
};
export type ContractCallResult<T> = {
    catTx: CatTx;
    contract: SmartContract;
    state: T;
    contractTaproot: TaprootSmartContract;
    atInputIndex: number;
    nexts: ContractIns<T>[];
};
export declare class TaprootSmartContract {
    contract: SmartContract;
    contractScript: btc.Script;
    contractScriptBuffer: Buffer;
    contractScriptHash: ByteString;
    tapleaf: string;
    tapleafBuffer: Buffer;
    tpubkey: string;
    cblock: string;
    cblockBuffer: Buffer;
    lockingScript: btc.Script;
    lockingScriptHex: string;
    constructor(contract: SmartContract);
    static create(contract: SmartContract): TaprootSmartContract;
}
export declare class TaprootMastSmartContract {
    tpubkey: string;
    lockingScript: btc.Script;
    lockingScriptHex: string;
    contractTaprootMap: Record<string, TaprootSmartContract>;
    constructor(contractMap: Record<string, SmartContract>);
    static create(contractMap: Record<string, SmartContract>): TaprootMastSmartContract;
}
export declare class CatTx {
    tx: btc.Transaction;
    state: ProtocolState;
    constructor();
    updateState(): void;
    static create(): CatTx;
    fromCatTx(otherCatTx: CatTx, outputIndex: number): number;
    addContractOutput(lockingScript: any, satoshis?: number): number;
    addStateContractOutput(lockingScript: any, stateString: ByteString, satoshis?: number): number;
    getUTXO(outputIndex: number): {
        txId: any;
        outputIndex: number;
        script: any;
        satoshis: any;
    };
    sign(seckey: any): void;
    getInputCtx(inputIndex: any, lockingScriptBuffer: any): {
        shPreimage: import("..").SHPreimage;
        prevoutsCtx: import("..").PrevoutsCtx;
        spentScripts: import("scrypt-ts").FixedArray<ByteString, 6>;
        sighash: {
            preimage: Buffer;
            hash: Buffer;
        };
    };
    getPreState(): {
        statesHashRoot: ByteString;
        txoStateHashes: import("./state").ProtocolStateList;
    };
}
export declare function script2P2TR(script: Buffer): {
    p2tr: string;
    tapScript: string;
    cblock: string;
};
//# sourceMappingURL=catTx.d.ts.map