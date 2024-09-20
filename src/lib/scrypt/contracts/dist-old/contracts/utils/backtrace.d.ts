import { SmartContractLib, ByteString } from 'scrypt-ts';
import { XrayedTxIdPreimg1, XrayedTxIdPreimg2, TxInput } from './txProof';
import { int32 } from './txUtil';
export type BacktraceInfo = {
    preTx: XrayedTxIdPreimg1;
    preTxInput: TxInput;
    preTxInputIndex: int32;
    prePreTx: XrayedTxIdPreimg2;
};
export declare class Backtrace extends SmartContractLib {
    static verifyUnique(preTxid: ByteString, backtraceInfo: BacktraceInfo, genesisOutpoint: ByteString, expectedScript: ByteString): boolean;
    static verifyToken(preTxid: ByteString, backtraceInfo: BacktraceInfo, minterScript: ByteString, expectedScript: ByteString): boolean;
}
//# sourceMappingURL=backtrace.d.ts.map