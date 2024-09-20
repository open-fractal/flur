import { ByteString, FixedArray } from 'scrypt-ts';
export type ProtocolStateList = FixedArray<ByteString, 5>;
export declare class ProtocolState {
    dataList?: ProtocolStateList;
    stateHashList: ProtocolStateList;
    private constructor();
    get hashRoot(): ByteString;
    get stateScript(): any;
    static toStateHashList(dataList: ProtocolStateList): ProtocolStateList;
    static fromDataList(dataList: ProtocolStateList): ProtocolState;
    static fromStateHashList(stateHashList: ProtocolStateList): ProtocolState;
    static getEmptyState(): ProtocolState;
    updateDataList(index: number, data: ByteString): void;
}
//# sourceMappingURL=state.d.ts.map