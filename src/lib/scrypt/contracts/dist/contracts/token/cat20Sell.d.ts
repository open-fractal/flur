import { ByteString, PubKey, PubKeyHash, Sig, SmartContract } from 'scrypt-ts';
import { ChangeInfo, int32 } from '../../index';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '../../index';
import { TxoStateHashes } from '../../index';
export declare class CAT20Sell extends SmartContract {
    cat20Script: ByteString;
    recvOutput: ByteString;
    sellerAddress: ByteString;
    price: int32;
    constructor(cat20Script: ByteString, recvOutput: ByteString, sellerAddress: ByteString, price: int32);
    take(curTxoStateHashes: TxoStateHashes, tokenInputIndex: int32, toBuyUserAmount: int32, sellChange: int32, buyUserAddress: PubKeyHash, tokenSatoshiBytes: ByteString, cancel: boolean, pubKeyPrefix: ByteString, ownerPubKey: PubKey, ownerSig: Sig, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
//# sourceMappingURL=cat20Sell.d.ts.map