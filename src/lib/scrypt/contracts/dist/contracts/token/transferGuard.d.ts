import { ByteString, FixedArray, SmartContract } from 'scrypt-ts';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { MAX_TOKEN_OUTPUT, int32 } from '../utils/txUtil';
import { XrayedTxIdPreimg3 } from '../utils/txProof';
import { GuardConstState } from './guardProto';
import { TxoStateHashes } from '../utils/stateUtils';
export declare class TransferGuard extends SmartContract {
    transfer(curTxoStateHashes: TxoStateHashes, ownerAddrOrScriptList: FixedArray<ByteString, typeof MAX_TOKEN_OUTPUT>, tokenAmountList: FixedArray<int32, typeof MAX_TOKEN_OUTPUT>, tokenOutputMaskList: FixedArray<boolean, typeof MAX_TOKEN_OUTPUT>, outputSatoshisList: FixedArray<ByteString, typeof MAX_TOKEN_OUTPUT>, tokenSatoshis: ByteString, preState: GuardConstState, preTx: XrayedTxIdPreimg3, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScripts: SpentScriptsCtx): void;
}
//# sourceMappingURL=transferGuard.d.ts.map