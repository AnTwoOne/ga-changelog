const axios = require('axios');

module.exports = async (req, res) => {
  const apiUrl = 'https://api.hubapi.com/cms/v3/hubdb/tables/7589438/rows?portalId=541808';

  try {
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};