const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const app = express();

app.get('/test', (req, res) => {
    res.json({ message: "Hello from Vercel!" });
  });

app.get('/feed.json', async (req, res) => {
  try {
    const response = await axios.get('https://api.hubapi.com/cms/v3/hubdb/tables/7589438/rows?portalId=541808');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = serverless(app);