const app = require('../lib/rssGenerator');
const serverless = require('serverless-http');

module.exports = serverless(app);