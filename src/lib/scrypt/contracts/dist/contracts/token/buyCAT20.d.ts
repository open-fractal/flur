import { ByteString, PubKey, PubKeyHash, Sig, SmartContract } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../../index';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../../index';
import { TxoStateHashes } from '../../index';
import { SpentAmountsCtx } from './sellUtil';
export declare class BuyCAT20 extends SmartContract {
    cat20Script: ByteString;
    buyerAddress: ByteString;
    price: int32;
    constructor(cat20Script: ByteString, buyerAddress: ByteString, price: int32);
    take(curTxoStateHashes: TxoStateHashes, preRemainingSatoshis: int32, toBuyerAmount: int32, toSellerAmount: int32, toSellerAddress: PubKeyHash, tokenSatoshiBytes: ByteString, tokenInputIndex: int32, cancel: boolean, pubKeyPrefix: ByteString, ownerPubKey: PubKey, ownerSig: Sig, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, spentAmountsCtx: SpentAmountsCtx, changeInfo: ChangeInfo): void;
}
//# sourceMappingURL=buyCAT20.d.ts.map