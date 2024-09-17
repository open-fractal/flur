if (process.browser) module.exports = require('./random.browser')
else module.exports = require('./random.node')
