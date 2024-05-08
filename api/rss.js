const axios = require('axios');
const RSS = require('rss');

module.exports = async (req, res) => {
  const apiUrl = 'https://api.hubapi.com/cms/v3/hubdb/tables/7589438/rows?portalId=541808';
  
  try {
    const response = await axios.get(apiUrl);
    const data = response.data.results;

    // Create a new RSS feed
    const feed = new RSS({
      title: 'Sample RSS Feed',
      description: 'This is a sample RSS feed generated from JSON data',
      feed_url: 'https://<your-vercel-url>/api/rss',
      site_url: 'https://www.yourwebsite.com',
      language: 'en',
    });

    // Add items to the RSS feed
    data.forEach(item => {
      feed.item({
        title: item.values.title,
        description: item.values.description,
        url: item.values.link, // Assuming 'link' is a property of the items
        guid: item.id,
        date: item.values.pubDate, // Assuming 'pubDate' is a property of the items
      });
    });

    // Generate XML from the RSS feed
    const xml = feed.xml({ indent: true });

    res.status(200).type('application/rss+xml').send(xml);
  } catch (error) {
    console.error('Error fetching data or generating RSS:', error);
    res.status(500).json({ error: 'Failed to fetch data or generate RSS feed' });
  }
};