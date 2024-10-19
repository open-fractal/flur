import { ByteString, PubKey, PubKeyHash, Sig, SmartContract } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { TxoStateHashes } from '../utils/stateUtils';
import { SpentAmountsCtx } from './sellUtil';
export declare class FXPCat20Buy extends SmartContract {
    cat20Script: ByteString;
    buyerAddress: ByteString;
    price: int32;
    scalePrice: boolean;
    constructor(cat20Script: ByteString, buyerAddress: ByteString, price: int32, scalePrice: boolean);
    take(curTxoStateHashes: TxoStateHashes, preRemainingAmount: int32, toBuyerAmount: int32, toSellerAmount: int32, toSellerAddress: PubKeyHash, tokenSatoshiBytes: ByteString, tokenInputIndex: int32, fxpReward: boolean, cancel: boolean, pubKeyPrefix: ByteString, ownerPubKey: PubKey, ownerSig: Sig, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, spentAmountsCtx: SpentAmountsCtx, changeInfo: ChangeInfo): void;
}
//# sourceMappingURL=FXPCat20Buy.d.ts.map