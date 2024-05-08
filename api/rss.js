const axios = require('axios');
const RSS = require('rss');

module.exports = async (req, res) => {
  const apiUrl = 'https://api.hubapi.com/cms/v3/hubdb/tables/7589438/rows?portalId=541808';

  try {
    const response = await axios.get(apiUrl);
    let feed = new RSS({
        title: 'Customer Stories',
        description: 'GetAccept Customer Stories',
        feed_url: 'https://ga-changelog.vercel.app/api/rss',
        site_url: 'https://www.getaccept.com/',
        language: 'en',
        pubDate: new Date().toUTCString(),
        custom_namespaces: {
            'media': 'http://search.yahoo.com/mrss/'
        }
    });

    response.data.results.forEach(item => {
      const tags = item.values.tags.map(tag => tag.name)
      feed.item({
        title: item.values.title,
        description: item.values.summary,
        enclosure: {url:item.values.card_image.url, type: 'image/webp'},
        category: `${tags[0]}`,
        url: item.values.link, // assuming 'link' is the URL
        guid: item.id,
        date: item.publishedAt, // assuming 'pubDate' is the publish date
        custom_elements: [
            {
                'media:content': {
                    _attr: {
                        url: item.values.card_image.url,
                        type: item.values.card_image.type,
                        width: item.values.card_image.width,
                        height: item.values.card_image.height
                    }
                },
                'media:description': {
                    _cdata: item.values.card_image.alt
                }
            }
        ]
      });
    });

    res.setHeader('Content-Type', 'application/rss+xml');
    res.send(feed.xml({ indent: true }));
  } catch (error) {
    console.error('Error fetching or generating RSS:', error);
    res.status(500).send('Failed to generate RSS feed.');
  }
};