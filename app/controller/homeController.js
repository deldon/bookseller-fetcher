const datamapper = require("../datamapper/isbnDataMapper");
const dayjs = require("dayjs");

module.exports = {
  getHome: async (req, res, next) => {
    res.render("home");
  },
  inputIsbn: async (req, res, next) => {
    const requset = req.body;

    requset.scan_date = dayjs().format("DD/MM/YY");

    let nData;
    try {
      const data = await datamapper.insertIsbn(requset);
      nData = await datamapper.selectIsbnNotScrap();
    } catch (error) {
      nData = "error";
    }

    res.json(nData);
  },
  selectIsbnNotScrap: async (req, res, next) => {
    let nData;
    try {
      nData = await datamapper.selectIsbnNotScrap();
    } catch (error) {
      nData = "error";
    }

    res.json(nData);
  },
};
