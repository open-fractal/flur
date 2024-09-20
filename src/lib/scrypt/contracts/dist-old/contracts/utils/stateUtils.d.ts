import { ByteString, FixedArray, SmartContractLib } from 'scrypt-ts';
import { MAX_STATE, int32 } from './txUtil';
import { XrayedTxIdPreimg3 } from './txProof';
export type TxoStateHashes = FixedArray<ByteString, typeof MAX_STATE>;
export type PreTxStatesInfo = {
    statesHashRoot: ByteString;
    txoStateHashes: TxoStateHashes;
};
export declare class StateUtils extends SmartContractLib {
    static verifyStateRoot(txoStateHashes: FixedArray<ByteString, typeof MAX_STATE>, statesHashRoot: ByteString): boolean;
    static getPadding(stateNumber: int32): ByteString;
    static getStateScript(hashString: ByteString, stateNumber: int32): ByteString;
    static getCurrentStateOutput(hashString: ByteString, stateNumber: int32, stateHashList: FixedArray<ByteString, typeof MAX_STATE>): ByteString;
    static verifyPreStateHash(statesInfo: PreTxStatesInfo, preStateHash: ByteString, preTxStateScript: ByteString, outputIndex: int32): boolean;
    static verifyGuardStateHash(preTx: XrayedTxIdPreimg3, preTxhash: ByteString, preStateHash: ByteString): boolean;
}
//# sourceMappingURL=stateUtils.d.ts.map