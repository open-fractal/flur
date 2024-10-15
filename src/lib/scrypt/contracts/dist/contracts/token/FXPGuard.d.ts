import { SmartContract } from 'scrypt-ts';
import { int32 } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { XrayedTxIdPreimg1 } from '../utils/txProof';
import { CAT20State } from './cat20Proto';
import { PreTxStatesInfo } from '../utils/stateUtils';
export declare class FXPGuard extends SmartContract {
    constructor();
    redeem(serviceFeeIndex: int32, preTx: XrayedTxIdPreimg1, preState: CAT20State, preTxStatesInfo: PreTxStatesInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx): void;
}
//# sourceMappingURL=FXPGuard.d.ts.map