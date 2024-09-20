import { ByteString, SmartContract, PubKey, Sig, FixedArray } from 'scrypt-ts';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { MAX_INPUT, int32 } from '../utils/txUtil';
import { XrayedTxIdPreimg3 } from '../utils/txProof';
import { PreTxStatesInfo } from '../utils/stateUtils';
import { CAT20State } from './cat20Proto';
import { GuardConstState } from './guardProto';
import { BacktraceInfo } from '../utils/backtrace';
export type GuardInfo = {
    tx: XrayedTxIdPreimg3;
    inputIndexVal: int32;
    outputIndex: ByteString;
    guardState: GuardConstState;
};
export type TokenUnlockArgs = {
    isUserSpend: boolean;
    userPubKeyPrefix: ByteString;
    userPubKey: PubKey;
    userSig: Sig;
    contractInputIndex: int32;
};
export declare class CAT20 extends SmartContract {
    minterScript: ByteString;
    guardScript: ByteString;
    constructor(minterScript: ByteString, guardScript: ByteString);
    unlock(tokenUnlockArgs: TokenUnlockArgs, preState: CAT20State, preTxStatesInfo: PreTxStatesInfo, guardInfo: GuardInfo, backtraceInfo: BacktraceInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScripts: SpentScriptsCtx): void;
    valitateGuard(guardInfo: GuardInfo, preScript: ByteString, preState: CAT20State, inputIndexVal: int32, prevouts: FixedArray<ByteString, typeof MAX_INPUT>, spentScripts: SpentScriptsCtx): boolean;
}
//# sourceMappingURL=cat20.d.ts.map