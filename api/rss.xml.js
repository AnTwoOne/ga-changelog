const axios = require('axios');
const RSS = require('rss');

module.exports = async (req, res) => {
  // Retrieve the tag from the query parameter, if provided
  const categoriesFilter = req.query.categories ? req.query.categories : '';
  const tagsFilter = req.query.tags ? req.query.tags : '';

  const apiUrl = `https://api.hubapi.com/cms/v3/hubdb/tables/18745726/rows?portalId=541808${categoriesFilter ? `&categories__in=${encodeURIComponent(categoriesFilter)}` : ''}${tagsFilter ? `&tags__in=${encodeURIComponent(tagsFilter)}` : ''}`;

  try {
    const response = await axios.get(apiUrl);

    let feed = new RSS({
      title: `Changelog result${categoriesFilter ? `: ${req.query.categories}` : ''}${tagsFilter ? ` & : ${req.query.tags}` : ''}`,  // Adjust title to indicate filtered content
      description: 'GetAccept Changelog',
      feed_url: `https://ga-changelog.vercel.app/api/rss.xml`,
      site_url: 'https://www.getaccept.com/',
      language: 'en',
      pubDate: new Date().toUTCString(),
      custom_namespaces: {
        'content': 'http://purl.org/rss/1.0/modules/content/'
      }
    });

    response.data.results.forEach(item => {
      let media = "";
      if (item.values.feature_image) {
        media = `
          <div class="hs-featured-image-wrapper"> <a href="${item.values.link}" title="" class="hs-featured-image-link"> <img src="${item.values.feature_image.url}" alt="${item.values.feature_image.alt}" class="hs-featured-image" style="width:auto !important; max-width:50%; float:left; margin:0 15px 15px 0;"> </a> </div>
        `;
      }
      if (item.values.video && !item.values.feature_image) {
        media = `
          <div class="hs-featured-image-wrapper"> <a href="${item.values.link}" title="" class="hs-featured-image-link"> <img src="${item.values.feature_image.url}" alt="${item.values.feature_image.alt}" class="hs-featured-image" style="width:auto !important; max-width:50%; float:left; margin:0 15px 15px 0;"> </a> </div>
        `;
      }
      feed.item({
        title: item.values.title,
        description: item.values.description,
        categories: item.values.categories ? item.values.categories.map(category => category.name) : [],
        url: item.values.link,
        guid: item.values.link,
        date: new Date(item.values.display_date).toUTCString(),
        custom_elements: [
          {
            'content:encoded': {
              _cdata: `<div style="display: flex; flex-direction: column; gap: 30px;">${media}<p>${item.values.description}</p></div>`
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

