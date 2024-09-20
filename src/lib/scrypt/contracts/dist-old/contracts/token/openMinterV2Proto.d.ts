import { ByteString, SmartContractLib } from 'scrypt-ts';
import { int32 } from '../utils/txUtil';
export type OpenMinterV2State = {
    tokenScript: ByteString;
    isPremined: boolean;
    remainingSupplyCount: int32;
};
export declare class OpenMinterV2Proto extends SmartContractLib {
    static stateHash(_state: OpenMinterV2State): ByteString;
    static create(tokenScript: ByteString, isPremined: boolean, remainingSupply: int32): OpenMinterV2State;
    static toByteString(_state: OpenMinterV2State): string;
    static getSplitAmountList(preRemainingSupply: int32, isPremined: boolean, premineAmount: bigint): import("scrypt-ts").FixedArray<bigint, 2>;
}
//# sourceMappingURL=openMinterV2Proto.d.ts.map