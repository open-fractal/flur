import { ByteString, FixedArray, SmartContract } from 'scrypt-ts';
import { PrevoutsCtx, SHPreimage } from '../utils/sigHashUtils';
import { MAX_TOKEN_OUTPUT } from '../utils/txUtil';
import { XrayedTxIdPreimg3 } from '../utils/txProof';
import { GuardConstState } from './guardProto';
import { TxoStateHashes } from '../utils/stateUtils';
export declare class BurnGuard extends SmartContract {
    burn(curTxoStateHashes: TxoStateHashes, outputScriptList: FixedArray<ByteString, typeof MAX_TOKEN_OUTPUT>, outputSatoshisList: FixedArray<ByteString, typeof MAX_TOKEN_OUTPUT>, preState: GuardConstState, preTx: XrayedTxIdPreimg3, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx): void;
}
//# sourceMappingURL=burnGuard.d.ts.map