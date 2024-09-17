import { SmartContract, ByteString, FixedArray, PubKey, Sig } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { BacktraceInfo } from '../utils/backtrace';
import { PreTxStatesInfo, TxoStateHashes } from '../utils/stateUtils';
import { CAT20State } from './cat20Proto';
import { OpenMinterV2State } from './openMinterV2Proto';
declare const MAX_NEXT_MINTERS = 2;
export declare class OpenMinterV2 extends SmartContract {
    genesisOutpoint: ByteString;
    maxCount: int32;
    premine: int32;
    premineCount: int32;
    limit: int32;
    premineAddr: ByteString;
    constructor(genesisOutpoint: ByteString, maxCount: int32, premine: int32, premineCount: int32, limit: int32, premineAddr: ByteString);
    mint(curTxoStateHashes: TxoStateHashes, tokenMint: CAT20State, nextMinterCounts: FixedArray<int32, typeof MAX_NEXT_MINTERS>, preminerPubKeyPrefix: ByteString, preminerPubKey: PubKey, preminerSig: Sig, minterSatoshis: ByteString, tokenSatoshis: ByteString, preState: OpenMinterV2State, preTxStatesInfo: PreTxStatesInfo, backtraceInfo: BacktraceInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
export {};
//# sourceMappingURL=openMinterV2.d.ts.map