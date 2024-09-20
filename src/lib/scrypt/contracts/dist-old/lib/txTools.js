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
exports.getTxCtxMulti = exports.getSHPreimageMulti = exports.toTxOutpoint = exports.getTxCtx = exports.getSHPreimage = exports.callToBufferList = exports.checkDisableOpCode = exports.getOutpointString = exports.getOutpointObj = exports.getSpentScripts = exports.getPrevoutsIndex = exports.getPrevouts = exports.toSHPreimageObj = exports.splitSighashPreimage = exports.getE = exports.getSigHashSchnorr = void 0;
const ecurve = __importStar(require("ecurve"));
const js_sha256_1 = require("js-sha256");
const bigi_1 = __importDefault(require("bigi"));
const proof_1 = require("./proof");
const scrypt_ts_1 = require("scrypt-ts");
const btc_1 = require("./btc");
const curve = ecurve.getCurveByName('secp256k1');
function hashSHA256(buff) {
    return Buffer.from(js_sha256_1.sha256.create().update(buff).array());
}
function getSigHashSchnorr(transaction, tapleafHash, inputIndex = 0, sigHashType = 0x00) {
    //const sighash = btc.Transaction.Sighash.sighash(transaction, sigHashType, inputIndex, subscript);
    const execdata = {
        annexPresent: false,
        annexInit: true,
        tapleafHash: tapleafHash,
        tapleafHashInit: true,
        ////validationWeightLeft: 110,
        ////validationWeightLeftInit: true,
        codeseparatorPos: new btc_1.btc.crypto.BN(4294967295),
        codeseparatorPosInit: true,
    };
    return {
        preimage: btc_1.btc.Transaction.SighashSchnorr.sighashPreimage(transaction, sigHashType, inputIndex, 3, execdata),
        hash: btc_1.btc.Transaction.SighashSchnorr.sighash(transaction, sigHashType, inputIndex, 3, execdata),
    };
}
exports.getSigHashSchnorr = getSigHashSchnorr;
function getE(sighash) {
    const Gx = curve.G.affineX.toBuffer(32);
    const tagHash = hashSHA256('BIP0340/challenge');
    const tagHashMsg = Buffer.concat([Gx, Gx, sighash]);
    const taggedHash = hashSHA256(Buffer.concat([tagHash, tagHash, tagHashMsg]));
    return bigi_1.default.fromBuffer(taggedHash).mod(curve.n);
}
exports.getE = getE;
function splitSighashPreimage(preimage) {
    return {
        tapSighash1: preimage.subarray(0, 32),
        tapSighash2: preimage.subarray(32, 64),
        epoch: preimage.subarray(64, 65),
        sighashType: preimage.subarray(65, 66),
        txVersion: preimage.subarray(66, 70),
        nLockTime: preimage.subarray(70, 74),
        hashPrevouts: preimage.subarray(74, 106),
        hashSpentAmounts: preimage.subarray(106, 138),
        hashScripts: preimage.subarray(138, 170),
        hashSequences: preimage.subarray(170, 202),
        hashOutputs: preimage.subarray(202, 234),
        spendType: preimage.subarray(234, 235),
        inputNumber: preimage.subarray(235, 239),
        tapleafHash: preimage.subarray(239, 271),
        keyVersion: preimage.subarray(271, 272),
        codeseparatorPosition: preimage.subarray(272),
    };
}
exports.splitSighashPreimage = splitSighashPreimage;
function toSHPreimageObj(preimageParts, _e, eLastByte) {
    return {
        txVer: (0, scrypt_ts_1.toHex)(preimageParts.txVersion),
        nLockTime: (0, scrypt_ts_1.toHex)(preimageParts.nLockTime),
        hashPrevouts: (0, scrypt_ts_1.toHex)(preimageParts.hashPrevouts),
        hashSpentAmounts: (0, scrypt_ts_1.toHex)(preimageParts.hashSpentAmounts),
        hashSpentScripts: (0, scrypt_ts_1.toHex)(preimageParts.hashScripts),
        hashSequences: (0, scrypt_ts_1.toHex)(preimageParts.hashSequences),
        hashOutputs: (0, scrypt_ts_1.toHex)(preimageParts.hashOutputs),
        spendType: (0, scrypt_ts_1.toHex)(preimageParts.spendType),
        inputIndex: (0, scrypt_ts_1.toHex)(preimageParts.inputNumber),
        hashTapLeaf: (0, scrypt_ts_1.toHex)(preimageParts.tapleafHash),
        keyVer: (0, scrypt_ts_1.toHex)(preimageParts.keyVersion),
        codeSeparator: (0, scrypt_ts_1.toHex)(preimageParts.codeseparatorPosition),
        _e: (0, scrypt_ts_1.toHex)(_e),
        eLastByte: BigInt(eLastByte),
    };
}
exports.toSHPreimageObj = toSHPreimageObj;
const getPrevouts = function (tx) {
    const lst = (0, proof_1.emptyFixedArray)();
    for (let i = 0; i < tx.inputs.length; i++) {
        const input = tx.inputs[i];
        const txid = input.prevTxId.toString('hex');
        const txhash = Buffer.from(txid, 'hex').reverse();
        const outputBuf = Buffer.alloc(4, 0);
        outputBuf.writeUInt32LE(input.outputIndex);
        lst[i] = Buffer.concat([txhash, outputBuf]).toString('hex');
    }
    return lst;
};
exports.getPrevouts = getPrevouts;
const getPrevoutsIndex = function (tx) {
    const lst = (0, proof_1.emptyFixedArray)();
    for (let i = 0; i < tx.inputs.length; i++) {
        const input = tx.inputs[i];
        const outputBuf = Buffer.alloc(4, 0);
        outputBuf.writeUInt32LE(input.outputIndex);
        lst[i] = outputBuf.toString('hex');
    }
    return lst;
};
exports.getPrevoutsIndex = getPrevoutsIndex;
const getSpentScripts = function (tx) {
    const lst = (0, proof_1.emptyFixedArray)();
    for (let i = 0; i < tx.inputs.length; i++) {
        const input = tx.inputs[i];
        const spentScript = input.output.script.toBuffer().toString('hex');
        lst[i] = spentScript;
    }
    return lst;
};
exports.getSpentScripts = getSpentScripts;
const getOutpointObj = function (tx, index) {
    const outputBuf = Buffer.alloc(4, 0);
    outputBuf.writeUInt32LE(index);
    return {
        txhash: Buffer.from(tx.id, 'hex').reverse().toString('hex'),
        outputIndex: outputBuf.toString('hex'),
    };
};
exports.getOutpointObj = getOutpointObj;
const getOutpointString = function (tx, index) {
    const outputBuf = Buffer.alloc(4, 0);
    outputBuf.writeUInt32LE(index);
    return (Buffer.from(tx.id, 'hex').reverse().toString('hex') +
        outputBuf.toString('hex'));
};
exports.getOutpointString = getOutpointString;
const checkDisableOpCode = function (scriptPubKey) {
    for (const chunk of scriptPubKey.chunks) {
        // New opcodes will be listed here. May use a different sigversion to modify existing opcodes.
        if (btc_1.btc.Opcode.isOpSuccess(chunk.opcodenum)) {
            console.log(chunk.opcodenum, btc_1.btc.Opcode.reverseMap[chunk.opcodenum]);
            return true;
        }
    }
    return false;
};
exports.checkDisableOpCode = checkDisableOpCode;
const callToBufferList = function (ct) {
    const callArgs = ct.tx.inputs[ct.atInputIndex].script.chunks.map((value) => {
        if (!value.buf) {
            if (value.opcodenum >= 81 && value.opcodenum <= 96) {
                const hex = (0, scrypt_ts_1.int2ByteString)(BigInt(value.opcodenum - 80));
                return Buffer.from(hex, 'hex');
            }
            else {
                return Buffer.from((0, scrypt_ts_1.toByteString)(''));
            }
        }
        return value.buf;
    });
    return callArgs;
};
exports.callToBufferList = callToBufferList;
function getSHPreimage(tx, inputIndex, scriptBuffer) {
    let e, eBuff, sighash;
    let eLastByte = -1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        sighash = getSigHashSchnorr(tx, scriptBuffer, inputIndex);
        e = getE(sighash.hash);
        eBuff = e.toBuffer(32);
        const lastByte = eBuff[eBuff.length - 1];
        if (lastByte < 127) {
            eLastByte = lastByte;
            break;
        }
        tx.nLockTime += 1;
    }
    if (eLastByte < 0) {
        throw new Error('No valid eLastByte!');
    }
    const _e = eBuff.slice(0, eBuff.length - 1); // e' - e without last byte
    const preimageParts = splitSighashPreimage(sighash.preimage);
    return {
        SHPreimageObj: toSHPreimageObj(preimageParts, _e, eLastByte),
        sighash: sighash,
    };
}
exports.getSHPreimage = getSHPreimage;
function getTxCtx(tx, inputIndex, scriptBuffer) {
    const { SHPreimageObj, sighash } = getSHPreimage(tx, inputIndex, scriptBuffer);
    const prevouts = (0, exports.getPrevouts)(tx);
    const spentScripts = (0, exports.getSpentScripts)(tx);
    const outputBuf = Buffer.alloc(4, 0);
    outputBuf.writeUInt32LE(tx.inputs[inputIndex].outputIndex);
    const prevoutsCtx = {
        prevouts: prevouts,
        inputIndexVal: BigInt(inputIndex),
        outputIndexVal: BigInt(tx.inputs[inputIndex].outputIndex),
        spentTxhash: Buffer.from(tx.inputs[inputIndex].prevTxId.toString('hex'), 'hex')
            .reverse()
            .toString('hex'),
        outputIndex: outputBuf.toString('hex'),
    };
    return {
        shPreimage: SHPreimageObj,
        prevoutsCtx: prevoutsCtx,
        spentScripts: spentScripts,
        sighash,
    };
}
exports.getTxCtx = getTxCtx;
function toTxOutpoint(txid, outputIndex) {
    const outputBuf = Buffer.alloc(4, 0);
    outputBuf.writeUInt32LE(outputIndex);
    return {
        txhash: Buffer.from(txid, 'hex').reverse().toString('hex'),
        outputIndex: outputBuf.toString('hex'),
    };
}
exports.toTxOutpoint = toTxOutpoint;
function getSHPreimageMulti(tx, inputIndexList, scriptBuffers) {
    let eList = [];
    let eBuffList = [];
    let sighashList = [];
    let found = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        sighashList = inputIndexList.map((inputIndex, index) => getSigHashSchnorr(tx, scriptBuffers[index], inputIndex));
        eList = sighashList.map((sighash) => getE(sighash.hash));
        eBuffList = eList.map((e) => e.toBuffer(32));
        if (eBuffList.every((eBuff) => {
            const lastByte = eBuff[eBuff.length - 1];
            return lastByte < 127;
        })) {
            found = true;
            break;
        }
        tx.nLockTime += 1;
    }
    if (!found) {
        throw new Error('No valid preimage found!');
    }
    const rList = [];
    for (let index = 0; index < inputIndexList.length; index++) {
        const eBuff = eBuffList[index];
        const sighash = sighashList[index];
        const _e = eBuff.slice(0, eBuff.length - 1); // e' - e without last byte
        const lastByte = eBuff[eBuff.length - 1];
        const preimageParts = splitSighashPreimage(sighash.preimage);
        rList.push({
            SHPreimageObj: toSHPreimageObj(preimageParts, _e, lastByte),
            sighash: sighash,
        });
    }
    return rList;
}
exports.getSHPreimageMulti = getSHPreimageMulti;
function getTxCtxMulti(tx, inputIndexList, scriptBuffers) {
    const preimages = getSHPreimageMulti(tx, inputIndexList, scriptBuffers);
    return inputIndexList.map((inputIndex, index) => {
        const { SHPreimageObj, sighash } = preimages[index];
        const prevouts = (0, exports.getPrevouts)(tx);
        const spentScripts = (0, exports.getSpentScripts)(tx);
        const outputBuf = Buffer.alloc(4, 0);
        outputBuf.writeUInt32LE(tx.inputs[inputIndex].outputIndex);
        const prevoutsCtx = {
            prevouts: prevouts,
            inputIndexVal: BigInt(inputIndex),
            outputIndexVal: BigInt(tx.inputs[inputIndex].outputIndex),
            spentTxhash: Buffer.from(tx.inputs[inputIndex].prevTxId.toString('hex'), 'hex')
                .reverse()
                .toString('hex'),
            outputIndex: outputBuf.toString('hex'),
        };
        return {
            shPreimage: SHPreimageObj,
            prevoutsCtx: prevoutsCtx,
            spentScripts: spentScripts,
            sighash,
        };
    });
}
exports.getTxCtxMulti = getTxCtxMulti;
//# sourceMappingURL=txTools.js.map