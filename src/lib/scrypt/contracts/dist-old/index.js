"use strict";
// import { join } from 'path'
// import { BurnGuard } from './contracts/token/burnGuard'
// import { ClosedMinter } from './contracts/token/closedMinter'
// import { OpenMinter } from './contracts/token/openMinter'
// import { CAT20 } from './contracts/token/cat20'
// import { TransferGuard } from './contracts/token/transferGuard'
// import { OpenMinterV2 } from './contracts/token/openMinterV2'
// ;(() => {
//     ClosedMinter.loadArtifact(
//         join(__dirname, '..', 'artifacts/contracts/token/closedMinter.json')
//     )
//     OpenMinter.loadArtifact(
//         join(__dirname, '..', 'artifacts/contracts/token/openMinter.json')
//     )
//     OpenMinterV2.loadArtifact(
//         join(__dirname, '..', 'artifacts/contracts/token/openMinterV2.json')
//     )
//     CAT20.loadArtifact(
//         join(__dirname, '..', 'artifacts/contracts/token/cat20.json')
//     )
//     BurnGuard.loadArtifact(
//         join(__dirname, '..', 'artifacts/contracts/token/burnGuard.json')
//     )
//     TransferGuard.loadArtifact(
//         join(__dirname, '..', 'artifacts/contracts/token/transferGuard.json')
//     )
// })()
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./contracts/token/closedMinter"), exports);
__exportStar(require("./contracts/token/cat20"), exports);
__exportStar(require("./contracts/token/burnGuard"), exports);
__exportStar(require("./contracts/token/transferGuard"), exports);
__exportStar(require("./contracts/token/cat20Proto"), exports);
__exportStar(require("./contracts/token/closedMinterProto"), exports);
__exportStar(require("./contracts/token/guardProto"), exports);
__exportStar(require("./contracts/token/openMinter"), exports);
__exportStar(require("./contracts/token/openMinterV2"), exports);
__exportStar(require("./contracts/token/openMinterProto"), exports);
__exportStar(require("./contracts/token/openMinterV2Proto"), exports);
__exportStar(require("./contracts/utils/txUtil"), exports);
__exportStar(require("./contracts/utils/txProof"), exports);
__exportStar(require("./contracts/utils/stateUtils"), exports);
__exportStar(require("./contracts/utils/backtrace"), exports);
__exportStar(require("./contracts/utils/sigHashUtils"), exports);
__exportStar(require("./lib/state"), exports);
__exportStar(require("./lib/proof"), exports);
__exportStar(require("./lib/txTools"), exports);
__exportStar(require("./lib/commit"), exports);
__exportStar(require("./lib/guardInfo"), exports);
//# sourceMappingURL=index.js.map