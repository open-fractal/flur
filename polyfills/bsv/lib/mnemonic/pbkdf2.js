if (process.browser) module.exports = require('./pbkdf2.browser')
else module.exports = require('./pbkdf2.node')
