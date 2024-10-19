import { MAX_INPUT, int32 } from '../../index';
import { ByteString, SmartContractLib, FixedArray } from 'scrypt-ts';
export type SpentAmountsCtx = FixedArray<ByteString, typeof MAX_INPUT>;
export declare class SellUtil extends SmartContractLib {
    static mergeSpentAmounts(spentAmounts: SpentAmountsCtx): ByteString;
    static checkSpentAmountsCtx(spentAmounts: SpentAmountsCtx, hashSpentAmounts: ByteString): boolean;
    static int32ToSatoshiBytes(amount: int32): ByteString;
    static int32ToSatoshiBytesScaled(amount: int32, scale: boolean): ByteString;
    static scale2ByteString(amount: int32): ByteString;
}
//# sourceMappingURL=sellUtil.d.ts.map