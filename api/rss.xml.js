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
            'content': 'http://purl.org/rss/1.0/modules/content/'
        }
    });

    response.data.results.forEach(item => {
      const tags = item.values.tags.map(tag => tag.name)
      feed.item({
        title: item.values.title,
        description: item.values.summary,
        categories: tags,
        url: item.values.link, // assuming 'link' is the URL
        guid: item.values.link,
        date: item.publishedAt, // assuming 'pubDate' is the publish date
        custom_elements: [
            {
                'content:encoded': {
                    _cdata: `<div class="hs-featured-image-wrapper"> <a href="${item.values.link}" title="" class="hs-featured-image-link"> <img src="${item.values.card_image.url}" alt="${item.values.card_image.alt}" class="hs-featured-image" style="width:auto !important; max-width:50%; float:left; margin:0 15px 15px 0;"> </a> </div><p>${item.values.summary}</p>`
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