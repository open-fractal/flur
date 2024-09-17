import { ByteString, FixedArray, SmartContractLib } from 'scrypt-ts';
import { MAX_INPUT, int32 } from '../utils/txUtil';
export type GuardConstState = {
    tokenScript: ByteString;
    inputTokenAmountArray: FixedArray<int32, typeof MAX_INPUT>;
};
export declare class GuardProto extends SmartContractLib {
    static stateHash(_state: GuardConstState): ByteString;
    static toByteString(state: GuardConstState): string;
    static createEmptyState(): GuardConstState;
    static toList(state: GuardConstState): ByteString[];
}
//# sourceMappingURL=guardProto.d.ts.map