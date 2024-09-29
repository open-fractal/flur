import { ByteString, PubKey, PubKeyHash, Sig, SmartContract } from 'scrypt-ts';
import { ChangeInfo, int32 } from '@cat-protocol/cat-smartcontracts';
import { PrevoutsCtx, SHPreimage, SpentScriptsCtx } from '@cat-protocol/cat-smartcontracts';
import { TxoStateHashes } from '@cat-protocol/cat-smartcontracts';
export declare class CAT20Sell extends SmartContract {
    cat20Script: ByteString;
    recvOutput: ByteString;
    sellerAddress: ByteString;
    price: int32;
    constructor(cat20Script: ByteString, recvOutput: ByteString, sellerAddress: ByteString, price: int32);
    take(curTxoStateHashes: TxoStateHashes, tokenInputIndex: int32, toBuyUserAmount: int32, sellChange: int32, buyUserAddress: PubKeyHash, tokenSatoshiBytes: ByteString, cancel: boolean, pubKeyPrefix: ByteString, ownerPubKey: PubKey, ownerSig: Sig, shPreimage: SHPreimage, prevoutsCtx: PrevoutsCtx, spentScriptsCtx: SpentScriptsCtx, changeInfo: ChangeInfo): void;
}
