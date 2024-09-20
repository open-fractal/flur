import { ByteString, SmartContractLib } from 'scrypt-ts';
import { int32 } from '../utils/txUtil';
export type CAT20State = {
    ownerAddr: ByteString;
    amount: int32;
};
export declare class CAT20Proto extends SmartContractLib {
    static stateHash(_state: CAT20State): ByteString;
    static create(amount: int32, address: ByteString): CAT20State;
    static toByteString(tokenInfo: CAT20State): string;
}
//# sourceMappingURL=cat20Proto.d.ts.map