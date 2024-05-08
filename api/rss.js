const axios = require('axios');
const RSS = require('rss');

module.exports = async (req, res) => {
  const apiUrl = 'https://api.hubapi.com/cms/v3/hubdb/tables/7589438/rows?portalId=541808';

  try {
    const response = await axios.get(apiUrl);
    let feed = new RSS({
        title: 'Sample RSS Feed',
        description: 'A sample RSS feed generated from HubSpot API data.',
        feed_url: 'https://www.yourwebsite.com/rss',
        site_url: 'https://www.yourwebsite.com',
        language: 'en',
        pubDate: new Date().toUTCString(),
    });

    response.data.results.forEach(item => {
      feed.item({
        title: item.values.title,
        description: item.values.description,
        url: item.values.link, // assuming 'link' is the URL
        guid: item.id,
        date: item.values.pubDate, // assuming 'pubDate' is the publish date
      });
    });

    res.setHeader('Content-Type', 'application/rss+xml');
    res.send(feed.xml({ indent: true }));
  } catch (error) {
    console.error('Error fetching or generating RSS:', error);
    res.status(500).send('Failed to generate RSS feed.');
  }
};