const app = require('../index.js');
const express = require('express');
const serverless = require('serverless-http');

module.exports = serverless(app);