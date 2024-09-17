import { SmartContract, ByteString, FixedArray, PubKey, Sig } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { BacktraceInfo } from '../utils/backtrace';
import { PreTxStatesInfo, TxoStateHashes } from '../utils/stateUtils';
import { CAT20State } from './cat20Proto';
import { OpenMinterState } from './openMinterProto';
export declare const MAX_NEXT_MINTERS = 2;
export declare class OpenMinter extends SmartContract {
    genesisOutpoint: ByteString;
    max: int32;
    premine: int32;
    limit: int32;
    premineAddr: ByteString;
    constructor(genesisOutpoint: ByteString, max: int32, premine: int32, limit: int32, premineAddr: ByteString);
    mint(curTxoStateHashes: TxoStateHashes, tokenMint: CAT20State, nextMinterAmounts: FixedArray<int32, typeof MAX_NEXT_MINTERS>, preminerPubKeyPrefix: ByteString, preminerPubKey: PubKey, preminerSig: Sig, minterSatoshis: ByteString, tokenSatoshis: ByteString, preState: OpenMinterState, preTxStatesInfo: PreTxStatesInfo, backtraceInfo: BacktraceInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
//# sourceMappingURL=openMinter.d.ts.map