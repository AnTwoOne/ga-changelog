const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

module.exports = serverless(app);