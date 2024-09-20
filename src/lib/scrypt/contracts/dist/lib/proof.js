"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackTraceInfoSearch = exports.getBackTraceInfo = exports.getTxHeaderCheck = exports.txToTxHeaderCheck = exports.txToTxHeaderTiny = exports.txToTxHeaderPartial = exports.txToTxHeader = exports.tokenAmountToByteString = exports.intArrayToByteString = exports.emptyTokenAmountArray = exports.emptyBigIntArray = exports.emptyTokenArray = exports.emptyFixedArray = void 0;
const bufferreader_1 = __importDefault(require("bitcore-lib-inquisition/lib/encoding/bufferreader"));
const scrypt_ts_1 = require("scrypt-ts");
const varuint = __importStar(require("varuint-bitcoin"));
const txUtil_1 = require("../contracts/utils/txUtil");
const emptyString = (0, scrypt_ts_1.toByteString)('');
const emptyFixedArray = function () {
    return (0, scrypt_ts_1.fill)(emptyString, txUtil_1.MAX_INPUT);
};
exports.emptyFixedArray = emptyFixedArray;
const emptyTokenArray = function () {
    return (0, scrypt_ts_1.fill)(emptyString, txUtil_1.MAX_TOKEN_OUTPUT);
};
exports.emptyTokenArray = emptyTokenArray;
const emptyBigIntArray = function () {
    return (0, scrypt_ts_1.fill)(0n, txUtil_1.MAX_INPUT);
};
exports.emptyBigIntArray = emptyBigIntArray;
const emptyTokenAmountArray = function () {
    return (0, scrypt_ts_1.fill)(0n, txUtil_1.MAX_TOKEN_OUTPUT);
};
exports.emptyTokenAmountArray = emptyTokenAmountArray;
const intArrayToByteString = function (array) {
    const rList = (0, exports.emptyFixedArray)();
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        rList[index] = (0, scrypt_ts_1.int2ByteString)(element);
    }
    return rList;
};
exports.intArrayToByteString = intArrayToByteString;
const tokenAmountToByteString = function (array) {
    const rList = (0, exports.emptyTokenArray)();
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        rList[index] = (0, scrypt_ts_1.int2ByteString)(element);
    }
    return rList;
};
exports.tokenAmountToByteString = tokenAmountToByteString;
const txToTxHeader = function (tx) {
    const headerReader = (0, bufferreader_1.default)(tx.toBuffer(true));
    const version = headerReader.read(4);
    const inputNumber = headerReader.readVarintNum();
    const inputTxhashList = (0, exports.emptyFixedArray)();
    const inputOutputIndexList = (0, exports.emptyFixedArray)();
    const inputScriptList = (0, exports.emptyFixedArray)();
    const inputSequenceList = (0, exports.emptyFixedArray)();
    for (let index = 0; index < inputNumber; index++) {
        const txhash = headerReader.read(32);
        const outputIndex = headerReader.read(4);
        const unlockScript = headerReader.readVarLengthBuffer();
        if (unlockScript.length > 0) {
            throw Error(`input ${index} unlocking script need eq 0`);
        }
        const sequence = headerReader.read(4);
        inputTxhashList[index] = (0, scrypt_ts_1.toHex)(txhash);
        inputOutputIndexList[index] = (0, scrypt_ts_1.toHex)(outputIndex);
        inputScriptList[index] = (0, scrypt_ts_1.toByteString)('00');
        inputSequenceList[index] = (0, scrypt_ts_1.toHex)(sequence);
    }
    const outputNumber = headerReader.readVarintNum();
    const outputSatoshisList = (0, exports.emptyFixedArray)();
    const outputScriptLenList = (0, exports.emptyFixedArray)();
    const outputScriptList = (0, exports.emptyFixedArray)();
    for (let index = 0; index < outputNumber; index++) {
        const satoshiBytes = headerReader.read(8);
        const scriptLen = headerReader.readVarintNum();
        const script = headerReader.read(scriptLen);
        outputSatoshisList[index] = (0, scrypt_ts_1.toHex)(satoshiBytes);
        outputScriptLenList[index] = (0, scrypt_ts_1.toHex)(varuint.encode(scriptLen));
        outputScriptList[index] = (0, scrypt_ts_1.toHex)(script);
    }
    const nLocktime = headerReader.read(4);
    return {
        version: (0, scrypt_ts_1.toHex)(version),
        inputCount: (0, scrypt_ts_1.toHex)(varuint.encode(inputNumber)),
        inputTxhashList: inputTxhashList,
        inputOutputIndexList: inputOutputIndexList,
        inputScriptList: inputScriptList,
        inputSequenceList: inputSequenceList,
        outputCount: (0, scrypt_ts_1.toHex)(varuint.encode(outputNumber)),
        outputSatoshisList: outputSatoshisList,
        outputScriptLenList: outputScriptLenList,
        outputScriptList: outputScriptList,
        nLocktime: (0, scrypt_ts_1.toHex)(nLocktime),
    };
};
exports.txToTxHeader = txToTxHeader;
const txToTxHeaderPartial = function (txHeader) {
    const inputs = (0, exports.emptyFixedArray)();
    for (let index = 0; index < inputs.length; index++) {
        inputs[index] =
            txHeader.inputTxhashList[index] +
                txHeader.inputOutputIndexList[index] +
                txHeader.inputScriptList[index] +
                txHeader.inputSequenceList[index];
    }
    const outputSatoshisList = (0, exports.emptyFixedArray)();
    const outputScriptList = (0, exports.emptyFixedArray)();
    for (let index = 0; index < outputSatoshisList.length; index++) {
        outputSatoshisList[index] = txHeader.outputSatoshisList[index];
        outputScriptList[index] = txHeader.outputScriptList[index];
    }
    return {
        version: txHeader.version,
        inputCount: txHeader.inputCount,
        inputs: inputs,
        outputCountVal: (0, scrypt_ts_1.byteString2Int)(txHeader.outputCount),
        outputCount: txHeader.outputCount,
        outputSatoshisList: outputSatoshisList,
        outputScriptList: outputScriptList,
        nLocktime: txHeader.nLocktime,
    };
};
exports.txToTxHeaderPartial = txToTxHeaderPartial;
const txToTxHeaderTiny = function (txHeader) {
    let inputString = (0, scrypt_ts_1.toByteString)('');
    const inputs = (0, exports.emptyFixedArray)();
    for (let index = 0; index < inputs.length; index++) {
        // inputs[index] =
        inputString +=
            txHeader.inputTxhashList[index] +
                txHeader.inputOutputIndexList[index] +
                txHeader.inputScriptList[index] +
                txHeader.inputSequenceList[index];
    }
    const prevList = (0, scrypt_ts_1.fill)(emptyString, 4);
    const _prevList = txHeader.version +
        txHeader.inputCount +
        inputString +
        txHeader.outputCount;
    for (let index = 0; index < 4; index++) {
        const start = index * 80 * 2;
        const end = start + 80 * 2;
        prevList[index] = _prevList.slice(start, end);
    }
    const outputSatoshisList = (0, exports.emptyFixedArray)();
    const outputScriptList = (0, exports.emptyFixedArray)();
    for (let index = 0; index < outputSatoshisList.length; index++) {
        outputSatoshisList[index] = txHeader.outputSatoshisList[index];
        outputScriptList[index] = txHeader.outputScriptList[index];
    }
    return {
        prevList: prevList,
        outputCountVal: (0, scrypt_ts_1.byteString2Int)(txHeader.outputCount),
        outputCount: txHeader.outputCount,
        outputSatoshisList,
        outputScriptList,
        nLocktime: txHeader.nLocktime,
    };
};
exports.txToTxHeaderTiny = txToTxHeaderTiny;
const txToTxHeaderCheck = function (txHeader) {
    let inputString = (0, scrypt_ts_1.toByteString)('');
    const inputs = (0, exports.emptyFixedArray)();
    for (let index = 0; index < inputs.length; index++) {
        inputString +=
            txHeader.inputTxhashList[index] +
                txHeader.inputOutputIndexList[index] +
                txHeader.inputScriptList[index] +
                txHeader.inputSequenceList[index];
    }
    const outputSatoshisList = (0, scrypt_ts_1.fill)(emptyString, txUtil_1.XRAYED_TXID_PREIMG3_OUTPUT_NUMBER);
    const outputScriptList = (0, scrypt_ts_1.fill)(emptyString, txUtil_1.XRAYED_TXID_PREIMG3_OUTPUT_NUMBER);
    for (let index = 0; index < outputSatoshisList.length; index++) {
        outputSatoshisList[index] = txHeader.outputSatoshisList[index];
        outputScriptList[index] = txHeader.outputScriptList[index];
    }
    return {
        prev: txHeader.version +
            txHeader.inputCount +
            inputString +
            txHeader.outputCount,
        outputCountVal: (0, scrypt_ts_1.byteString2Int)(txHeader.outputCount),
        outputCount: txHeader.outputCount,
        outputSatoshisList,
        outputScriptList: outputScriptList,
        nLocktime: txHeader.nLocktime,
    };
};
exports.txToTxHeaderCheck = txToTxHeaderCheck;
const getTxHeaderCheck = function (tx, outputIndex) {
    const txHeader = (0, exports.txToTxHeader)(tx);
    const outputBuf = Buffer.alloc(4, 0);
    outputBuf.writeUInt32LE(outputIndex);
    return {
        tx: (0, exports.txToTxHeaderCheck)(txHeader),
        outputBytes: outputBuf.toString('hex'),
        outputIndex: BigInt(outputIndex),
        outputPre: txHeader.outputSatoshisList[outputIndex] +
            txHeader.outputScriptLenList[outputIndex],
    };
};
exports.getTxHeaderCheck = getTxHeaderCheck;
const getBackTraceInfo = function (preTx, prePreTx, inputIndex) {
    const preTxHeader = (0, exports.txToTxHeader)(preTx);
    const prePreTxHeader = (0, exports.txToTxHeader)(prePreTx);
    const preTxHeaderPartial = (0, exports.txToTxHeaderPartial)(preTxHeader);
    const prePreTxHeaderTiny = (0, exports.txToTxHeaderTiny)(prePreTxHeader);
    const preTxInput = {
        txhash: preTxHeader.inputTxhashList[inputIndex],
        outputIndex: preTxHeader.inputOutputIndexList[inputIndex],
        outputIndexVal: (0, scrypt_ts_1.byteString2Int)(preTxHeader.inputOutputIndexList[inputIndex]),
        sequence: preTxHeader.inputSequenceList[inputIndex],
    };
    return {
        preTx: preTxHeaderPartial,
        preTxInput: preTxInput,
        preTxInputIndex: BigInt(inputIndex),
        prePreTx: prePreTxHeaderTiny,
    };
};
exports.getBackTraceInfo = getBackTraceInfo;
const getBackTraceInfoSearch = function (preTx, prePreTx, script, minterScript) {
    let inputNumber = -1;
    for (let index = 0; index < preTx.inputs.length; index++) {
        const preTxInput = preTx.inputs[index];
        const preScript = preTxInput.output.script.toBuffer().toString('hex');
        if (preScript == script || preScript == minterScript) {
            inputNumber = index;
            break;
        }
    }
    if (inputNumber == -1) {
        throw new Error('not find prev');
    }
    const preTxHeader = (0, exports.txToTxHeader)(preTx);
    const prePreTxHeader = (0, exports.txToTxHeader)(prePreTx);
    const preTxHeaderPartial = (0, exports.txToTxHeaderPartial)(preTxHeader);
    const prePreTxHeaderTiny = (0, exports.txToTxHeaderTiny)(prePreTxHeader);
    const preTxInput = {
        txhash: preTxHeader.inputTxhashList[inputNumber],
        outputIndex: preTxHeader.inputOutputIndexList[inputNumber],
        outputIndexVal: (0, scrypt_ts_1.byteString2Int)(preTxHeader.inputOutputIndexList[inputNumber]),
        sequence: preTxHeader.inputSequenceList[inputNumber],
    };
    return {
        preTx: preTxHeaderPartial,
        preTxInput: preTxInput,
        preTxInputIndex: BigInt(inputNumber),
        prePreTx: prePreTxHeaderTiny,
    };
};
exports.getBackTraceInfoSearch = getBackTraceInfoSearch;
//# sourceMappingURL=proof.js.map