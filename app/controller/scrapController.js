const scrapDataMapper = require("../../scrapper/scrapDataMapper");

module.exports = {
  fetchThumbnail: async (req, res, next) => {
    try {
      data = await scrapDataMapper.getThumbnail(req.params.isbn);
      console.log(data);
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  },
  fetchPrice: async (req, res, next) => {
    try {
      data = await scrapDataMapper.getPrice(req.params.isbn);
      console.log(data);
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  },
};
