import { SmartContract, ByteString, PubKey, Sig } from 'scrypt-ts';
import { ChangeInfo } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { BacktraceInfo } from '../utils/backtrace';
import { ClosedMinterState } from './closedMinterProto';
import { PreTxStatesInfo, TxoStateHashes } from '../utils/stateUtils';
import { CAT20State } from './cat20Proto';
export declare class ClosedMinter extends SmartContract {
    issuerAddress: ByteString;
    genesisOutpoint: ByteString;
    constructor(ownerAddress: ByteString, genesisOutpoint: ByteString);
    mint(curTxoStateHashes: TxoStateHashes, tokenMint: CAT20State, issuerPubKeyPrefix: ByteString, issuerPubKey: PubKey, issuerSig: Sig, genesisSatoshis: ByteString, tokenSatoshis: ByteString, preState: ClosedMinterState, preTxStatesInfo: PreTxStatesInfo, backtraceInfo: BacktraceInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScripts: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
//# sourceMappingURL=closedMinter.d.ts.map