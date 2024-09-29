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
Object.defineProperty(exports, '__esModule', { value: true })
const path_1 = require('path')
const cat20Sell_1 = require('./contracts/cat20Sell')
// (() => {
//     cat20Sell_1.CAT20Sell.loadArtifact((0, path_1.join)(__dirname, '..', 'artifacts', 'token', 'cat20Sell.json'));
// })();
__exportStar(require('./contracts/cat20Sell'), exports)
//# sourceMappingURL=index.js.map
