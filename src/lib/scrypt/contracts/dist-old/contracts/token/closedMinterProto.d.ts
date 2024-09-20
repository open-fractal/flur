import { ByteString, SmartContractLib } from 'scrypt-ts';
export type ClosedMinterState = {
    tokenScript: ByteString;
};
export declare class ClosedMinterProto extends SmartContractLib {
    static stateHash(_state: ClosedMinterState): ByteString;
}
//# sourceMappingURL=closedMinterProto.d.ts.map