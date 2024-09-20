"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuardContractInfo = void 0;
const index_1 = require("../index");
const index_2 = require("../index");
const catTx_1 = require("./catTx");
const getGuardContractInfo = function () {
    const burnGuard = new index_1.BurnGuard();
    const transfer = new index_2.TransferGuard();
    const contractMap = {
        burn: burnGuard,
        transfer: transfer,
    };
    const guardInfo = new catTx_1.TaprootMastSmartContract(contractMap);
    return guardInfo;
};
exports.getGuardContractInfo = getGuardContractInfo;
//# sourceMappingURL=guardInfo.js.map