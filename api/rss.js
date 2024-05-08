const express = require('express');
const serverless = require('serverless-http');
const app = express();
const rssGenerator = require('../lib/rssGenerator'); // Assuming rssGenerator exports the express app.

app.use('/api', rssGenerator);

app.get('/test', (req, res) => {
    res.send('Serverless function is working!');
  });

module.exports = serverless(app);
