"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolState = void 0;
const scrypt_ts_1 = require("scrypt-ts");
const txUtil_1 = require("../contracts/utils/txUtil");
const btc_1 = require("./btc");
const emptyString = (0, scrypt_ts_1.toByteString)('');
class ProtocolState {
    constructor(stateHashList, dataList) {
        this.stateHashList = stateHashList;
        this.dataList = dataList;
    }
    get hashRoot() {
        let hashData = '';
        for (let i = 0; i < this.stateHashList.length; i++) {
            hashData += (0, scrypt_ts_1.hash160)(this.stateHashList[i]);
        }
        return (0, scrypt_ts_1.hash160)(hashData);
    }
    get stateScript() {
        return new btc_1.btc.Script(txUtil_1.TxUtil.getStateScript(this.hashRoot));
    }
    static toStateHashList(dataList) {
        const stateHashList = [
            emptyString,
            emptyString,
            emptyString,
            emptyString,
            emptyString,
        ];
        for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];
            if (data) {
                stateHashList[i] = (0, scrypt_ts_1.hash160)(data);
            }
        }
        return stateHashList;
    }
    static fromDataList(dataList) {
        return new ProtocolState(ProtocolState.toStateHashList(dataList), dataList);
    }
    static fromStateHashList(stateHashList) {
        return new ProtocolState(stateHashList);
    }
    static getEmptyState() {
        const dataList = [
            emptyString,
            emptyString,
            emptyString,
            emptyString,
            emptyString,
        ];
        return ProtocolState.fromDataList(dataList);
    }
    updateDataList(index, data) {
        this.dataList[index] = data;
        this.stateHashList = ProtocolState.toStateHashList(this.dataList);
    }
}
exports.ProtocolState = ProtocolState;
//# sourceMappingURL=state.js.map