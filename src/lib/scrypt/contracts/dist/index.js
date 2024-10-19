'use strict'
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function(o, m, k, k2) {
				if (k2 === undefined) k2 = k
				var desc = Object.getOwnPropertyDescriptor(m, k)
				if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
					desc = {
						enumerable: true,
						get: function() {
							return m[k]
						}
					}
				}
				Object.defineProperty(o, k2, desc)
		  }
		: function(o, m, k, k2) {
				if (k2 === undefined) k2 = k
				o[k2] = m[k]
		  })
var __exportStar =
	(this && this.__exportStar) ||
	function(m, exports) {
		for (var p in m)
			if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
				__createBinding(exports, m, p)
	}
// var __importDefault =
// 	(this && this.__importDefault) ||
// 	function(mod) {
// 		return mod && mod.__esModule ? mod : { default: mod }
// 	}
Object.defineProperty(exports, '__esModule', { value: true })
// const burnGuard_1 = require("./contracts/token/burnGuard");
// const closedMinter_1 = require("./contracts/token/closedMinter");
// const openMinter_1 = require("./contracts/token/openMinter");
// const cat20_1 = require("./contracts/token/cat20");
// const transferGuard_1 = require("./contracts/token/transferGuard");
// const openMinterV2_1 = require("./contracts/token/openMinterV2");
// const cat20Sell_1 = require("./contracts/token/cat20Sell");
// const buyCAT20_1 = require("./contracts/token/buyCAT20");
// const FXPCat20Buy_1 = require("./contracts/token/FXPCat20Buy");
// const FXPOpenMinter_1 = require("./contracts/token/FXPOpenMinter");
// const FXPBuyGuard_1 = require("./contracts/token/FXPBuyGuard");
// const FXPSellGuard_1 = require("./contracts/token/FXPSellGuard");
// const closedMinter_json_1 = __importDefault(require("../artifacts/contracts/token/closedMinter.json"));
// const openMinter_json_1 = __importDefault(require("../artifacts/contracts/token/openMinter.json"));
// const openMinterV2_json_1 = __importDefault(require("../artifacts/contracts/token/openMinterV2.json"));
// const cat20_json_1 = __importDefault(require("../artifacts/contracts/token/cat20.json"));
// const burnGuard_json_1 = __importDefault(require("../artifacts/contracts/token/burnGuard.json"));
// const transferGuard_json_1 = __importDefault(require("../artifacts/contracts/token/transferGuard.json"));
// const cat20Sell_json_1 = __importDefault(require("../artifacts/contracts/token/cat20Sell.json"));
// const buyCAT20_json_1 = __importDefault(require("../artifacts/contracts/token/buyCAT20.json"));
// const FXPCat20Buy_json_1 = __importDefault(require("../artifacts/contracts/token/FXPCat20Buy.json"));
// const FXPOpenMinter_json_1 = __importDefault(require("../artifacts/contracts/token/FXPOpenMinter.json"));
// const FXPBuyGuard_json_1 = __importDefault(require("../artifacts/contracts/token/FXPBuyGuard.json"));
// const FXPSellGuard_json_1 = __importDefault(require("../artifacts/contracts/token/FXPSellGuard.json"));
// (() => {
//     closedMinter_1.ClosedMinter.loadArtifact(closedMinter_json_1.default);
//     openMinter_1.OpenMinter.loadArtifact(openMinter_json_1.default);
//     openMinterV2_1.OpenMinterV2.loadArtifact(openMinterV2_json_1.default);
//     cat20_1.CAT20.loadArtifact(cat20_json_1.default);
//     burnGuard_1.BurnGuard.loadArtifact(burnGuard_json_1.default);
//     transferGuard_1.TransferGuard.loadArtifact(transferGuard_json_1.default);
//     cat20Sell_1.CAT20Sell.loadArtifact(cat20Sell_json_1.default);
//     buyCAT20_1.BuyCAT20.loadArtifact(buyCAT20_json_1.default);
//     FXPBuyGuard_1.FXPBuyGuard.loadArtifact(FXPBuyGuard_json_1.default);
//     FXPSellGuard_1.FXPSellGuard.loadArtifact(FXPSellGuard_json_1.default);
//     FXPCat20Buy_1.FXPCat20Buy.loadArtifact(FXPCat20Buy_json_1.default);
//     // FXPCat20Sell.loadArtifact(fxpCat20Sell)
//     FXPOpenMinter_1.FXPOpenMinter.loadArtifact(FXPOpenMinter_json_1.default);
// })();
__exportStar(require('./contracts/token/closedMinter'), exports)
__exportStar(require('./contracts/token/cat20'), exports)
__exportStar(require('./contracts/token/burnGuard'), exports)
__exportStar(require('./contracts/token/transferGuard'), exports)
__exportStar(require('./contracts/token/cat20Proto'), exports)
__exportStar(require('./contracts/token/closedMinterProto'), exports)
__exportStar(require('./contracts/token/guardProto'), exports)
__exportStar(require('./contracts/token/openMinter'), exports)
__exportStar(require('./contracts/token/openMinterV2'), exports)
__exportStar(require('./contracts/token/openMinterProto'), exports)
__exportStar(require('./contracts/token/openMinterV2Proto'), exports)
__exportStar(require('./contracts/utils/txUtil'), exports)
__exportStar(require('./contracts/utils/txProof'), exports)
__exportStar(require('./contracts/utils/stateUtils'), exports)
__exportStar(require('./contracts/utils/backtrace'), exports)
__exportStar(require('./contracts/utils/sigHashUtils'), exports)
__exportStar(require('./lib/state'), exports)
__exportStar(require('./lib/proof'), exports)
__exportStar(require('./lib/txTools'), exports)
__exportStar(require('./lib/commit'), exports)
__exportStar(require('./lib/guardInfo'), exports)
__exportStar(require('./contracts/token/cat20Sell'), exports)
__exportStar(require('./contracts/token/buyCAT20'), exports)
__exportStar(require('./contracts/token/FXPCat20Buy'), exports)
__exportStar(require('./contracts/token/FXPCat20Sell'), exports)
__exportStar(require('./contracts/token/FXPOpenMinter'), exports)
__exportStar(require('./contracts/token/FXPBuyGuard'), exports)
__exportStar(require('./contracts/token/FXPSellGuard'), exports)
//# sourceMappingURL=index.js.map
