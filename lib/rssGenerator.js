const express = require('express');
const axios = require('axios');
const app = express();

// A static API endpoint that generates an RSS feed
app.get('/rss.xml', async (req, res) => {
  const url = `https://api.hubapi.com/cms/v3/hubdb/tables/7589438/rows?portalId=541808`;

  try {
    const response = await axios.get(url);
    const data = response.data.results;
    const rss = generateRSS(data);
    res.set('Content-Type', 'application/rss+xml');
    res.send(rss);
  } catch (error) {
    console.error('Error fetching HubDB data:', error);
    res.status(500).send('Failed to generate RSS feed.');
  }
});

function generateRSS(rows) {
  const itemsXml = rows.map(row => `
    <item>
      <title>${row.values.title}</title>
      <link>${row.values.link}</link>
      <description>${row.values.description}</description>
      <pubDate>${new Date(row.values.pubDate).toUTCString()}</pubDate>
      <guid isPermaLink="false">${row.id}</guid>
    </item>
  `).join('');

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Sample RSS Feed Title</title>
        <link>https://www.yourwebsite.com/rss</link>
        <description>Description of your sample RSS feed</description>
        <language>en-us</language>
        ${itemsXml}
      </channel>
    </rss>
  `;
}

module.exports = app;

