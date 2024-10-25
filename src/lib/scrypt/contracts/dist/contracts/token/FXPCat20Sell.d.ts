import { ByteString, PubKey, PubKeyHash, Sig, SmartContract } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../utils/txUtil';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../utils/sigHashUtils';
import { TxoStateHashes } from '../utils/stateUtils';
export declare class FXPCat20Sell extends SmartContract {
    cat20Script: ByteString;
    recvOutput: ByteString;
    sellerAddress: ByteString;
    price: int32;
    scalePrice: boolean;
    constructor(cat20Script: ByteString, recvOutput: ByteString, sellerAddress: ByteString, price: int32, scalePrice: boolean);
    take(curTxoStateHashes: TxoStateHashes, tokenInputIndex: int32, toBuyUserAmount: int32, sellChange: int32, buyUserAddress: PubKeyHash, tokenSatoshiBytes: ByteString, fxpReward: boolean, cancel: boolean, pubKeyPrefix: ByteString, ownerPubKey: PubKey, ownerSig: Sig, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
//# sourceMappingURL=FXPCat20Sell.d.ts.map