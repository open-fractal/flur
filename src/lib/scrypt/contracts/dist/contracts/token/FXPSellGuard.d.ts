import { SmartContract } from 'scrypt-ts';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { XrayedTxIdPreimg1 } from '../utils/txProof';
import { CAT20State } from './cat20Proto';
import { PreTxStatesInfo } from '../utils/stateUtils';
export declare class FXPSellGuard extends SmartContract {
    constructor();
    redeem(preTx: XrayedTxIdPreimg1, preState: CAT20State, preTxStatesInfo: PreTxStatesInfo, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx): void;
}
//# sourceMappingURL=FXPSellGuard.d.ts.map