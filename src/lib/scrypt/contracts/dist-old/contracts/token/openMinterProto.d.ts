import { ByteString, SmartContractLib } from 'scrypt-ts';
import { int32 } from '../utils/txUtil';
export type OpenMinterState = {
    tokenScript: ByteString;
    isPremined: boolean;
    remainingSupply: int32;
};
export declare class OpenMinterProto extends SmartContractLib {
    static stateHash(_state: OpenMinterState): ByteString;
    static create(tokenScript: ByteString, isPremined: boolean, remainingSupply: int32): OpenMinterState;
    static toByteString(_state: OpenMinterState): string;
    static getSplitAmountList(preMax: int32, mintAmount: int32, limit: int32, splitMinterNumber: number): import("scrypt-ts").FixedArray<bigint, 2>;
}
//# sourceMappingURL=openMinterProto.d.ts.map