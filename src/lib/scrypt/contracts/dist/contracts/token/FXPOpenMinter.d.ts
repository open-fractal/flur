import { SmartContract, ByteString, FixedArray, PubKey } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { BacktraceInfo } from '../utils/backtrace';
import { PreTxStatesInfo, TxoStateHashes } from '../utils/stateUtils';
import { CAT20State } from './cat20Proto';
import { OpenMinterV2State } from './openMinterV2Proto';
import { XrayedTxIdPreimg1 } from '../utils/txProof';
declare const MAX_NEXT_MINTERS = 2;
export declare class FXPOpenMinter extends SmartContract {
    genesisOutpoint: ByteString;
    maxCount: int32;
    premine: int32;
    premineCount: int32;
    limit: int32;
    premineAddr: ByteString;
    constructor(genesisOutpoint: ByteString, maxCount: int32, premine: int32, premineCount: int32, limit: int32, premineAddr: ByteString);
    static getFXPAmount(tx: XrayedTxIdPreimg1): int32;
    static getFXPAmountHash(tx: XrayedTxIdPreimg1): ByteString;
    mint(curTxoStateHashes: TxoStateHashes, tokenMint: CAT20State, tokenAmount: int32, nextMinterCounts: FixedArray<int32, typeof MAX_NEXT_MINTERS>, guardPreTx: XrayedTxIdPreimg1, guardPreState: CAT20State, guardPreTxStatesInfo: PreTxStatesInfo, guardAmountHashSuffix: ByteString, guardTakerPubkey: PubKey, minterSatoshis: ByteString, tokenSatoshis: ByteString, preState: OpenMinterV2State, preTxStatesInfo: PreTxStatesInfo, backtraceInfo: BacktraceInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
export {};
//# sourceMappingURL=FXPOpenMinter.d.ts.map