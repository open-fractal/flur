"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script2P2TR = exports.CatTx = exports.TaprootMastSmartContract = exports.TaprootSmartContract = void 0;
const state_1 = require("./state");
const scrypt_ts_1 = require("scrypt-ts");
const txTools_1 = require("./txTools");
const tapscript_1 = require("@cmdcode/tapscript"); // Requires node >= 19
const btc_1 = require("./btc");
const TAPROOT_ONLY_SCRIPT_SPENT_KEY = '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';
class TaprootSmartContract {
    constructor(contract) {
        const contractScript = contract.lockingScript;
        const tapleaf = tapscript_1.Tap.encodeScript(contractScript.toBuffer());
        const [tpubkey, cblock] = tapscript_1.Tap.getPubKey(TAPROOT_ONLY_SCRIPT_SPENT_KEY, {
            target: tapleaf,
        });
        const lockingScript = new btc_1.btc.Script(`OP_1 32 0x${tpubkey}}`);
        this.contract = contract;
        this.contractScript = contractScript;
        this.contractScriptBuffer = contractScript.toBuffer();
        this.contractScriptHash = (0, scrypt_ts_1.hash160)(this.contractScriptBuffer.toString('hex'));
        this.tapleaf = tapleaf;
        this.tapleafBuffer = Buffer.from(tapleaf, 'hex');
        this.tpubkey = tpubkey;
        this.cblock = cblock;
        this.cblockBuffer = Buffer.from(cblock, 'hex');
        this.lockingScript = lockingScript;
        this.lockingScriptHex = lockingScript.toBuffer().toString('hex');
    }
    static create(contract) {
        return new TaprootSmartContract(contract);
    }
}
exports.TaprootSmartContract = TaprootSmartContract;
class TaprootMastSmartContract {
    constructor(contractMap) {
        const contractTaprootMap = {};
        const tapTree = [];
        for (const cK of Object.keys(contractMap)) {
            const contract = contractMap[cK];
            contractTaprootMap[cK] = TaprootSmartContract.create(contract);
            const script = contract.lockingScript;
            const tapleaf = tapscript_1.Tap.encodeScript(script.toBuffer());
            tapTree.push(tapleaf);
            contractTaprootMap[cK].tapleaf = tapleaf;
            contractTaprootMap[cK].tapleafBuffer = Buffer.from(tapleaf, 'hex');
        }
        const [tpubkey] = tapscript_1.Tap.getPubKey(TAPROOT_ONLY_SCRIPT_SPENT_KEY, {
            tree: tapTree,
        });
        const lockingScript = new btc_1.btc.Script(`OP_1 32 0x${tpubkey}}`);
        for (const cK of Object.keys(contractTaprootMap)) {
            const contractTaproot = contractTaprootMap[cK];
            const [, cblock] = tapscript_1.Tap.getPubKey(TAPROOT_ONLY_SCRIPT_SPENT_KEY, {
                target: contractTaproot.tapleaf,
                tree: tapTree,
            });
            contractTaproot.tpubkey = tpubkey;
            contractTaproot.cblock = cblock;
            contractTaproot.cblockBuffer = Buffer.from(cblock, 'hex');
            contractTaproot.lockingScript = lockingScript;
            contractTaproot.lockingScriptHex = lockingScript
                .toBuffer()
                .toString('hex');
        }
        this.tpubkey = tpubkey;
        this.lockingScript = lockingScript;
        this.lockingScriptHex = lockingScript.toBuffer().toString('hex');
        this.contractTaprootMap = contractTaprootMap;
    }
    static create(contractMap) {
        return new TaprootMastSmartContract(contractMap);
    }
}
exports.TaprootMastSmartContract = TaprootMastSmartContract;
class CatTx {
    constructor() {
        this.tx = new btc_1.btc.Transaction();
        this.state = state_1.ProtocolState.getEmptyState();
        this.tx.addOutput(new btc_1.btc.Transaction.Output({
            satoshis: 0,
            script: this.state.stateScript,
        }));
    }
    updateState() {
        this.tx.outputs[0] = new btc_1.btc.Transaction.Output({
            satoshis: 0,
            script: this.state.stateScript,
        });
    }
    static create() {
        return new CatTx();
    }
    fromCatTx(otherCatTx, outputIndex) {
        this.tx.from(otherCatTx.getUTXO(outputIndex));
        return this.tx.inputs.length - 1;
    }
    addContractOutput(lockingScript, satoshis = 330) {
        this.tx.addOutput(new btc_1.btc.Transaction.Output({
            satoshis: satoshis,
            script: lockingScript,
        }));
        const index = this.tx.outputs.length - 1;
        this.state.updateDataList(index - 1, (0, scrypt_ts_1.toByteString)(''));
        this.updateState();
        return this.tx.outputs.length - 1;
    }
    addStateContractOutput(lockingScript, stateString, satoshis = 330) {
        this.tx.addOutput(new btc_1.btc.Transaction.Output({
            satoshis: satoshis,
            script: lockingScript,
        }));
        const index = this.tx.outputs.length - 1;
        this.state.updateDataList(index - 1, stateString);
        this.updateState();
        return index;
    }
    getUTXO(outputIndex) {
        return {
            txId: this.tx.id,
            outputIndex: outputIndex,
            script: this.tx.outputs[outputIndex].script,
            satoshis: this.tx.outputs[outputIndex].satoshis,
        };
    }
    sign(seckey) {
        this.tx.sign(seckey);
    }
    getInputCtx(inputIndex, lockingScriptBuffer) {
        return (0, txTools_1.getTxCtx)(this.tx, inputIndex, lockingScriptBuffer);
    }
    getPreState() {
        return {
            statesHashRoot: this.state.hashRoot,
            txoStateHashes: this.state.stateHashList,
        };
    }
}
exports.CatTx = CatTx;
function script2P2TR(script) {
    const tapScript = tapscript_1.Tap.encodeScript(script);
    const [p2tr, cblock] = tapscript_1.Tap.getPubKey(TAPROOT_ONLY_SCRIPT_SPENT_KEY, {
        target: tapScript,
    });
    return {
        p2tr: new btc_1.btc.Script(`OP_1 32 0x${p2tr}}`).toHex(),
        tapScript: tapScript,
        cblock,
    };
}
exports.script2P2TR = script2P2TR;
//# sourceMappingURL=catTx.js.map