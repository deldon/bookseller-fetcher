const dataMapper = require("../datamapper/bookDataMapper");
const dayjs = require("dayjs");

module.exports = {
  selectBookNotFetch: async (req, res, next) => {
    data = await dataMapper.selectBookNotFetch();

    data.map((book) => {
      let color = "table-light";

      if (book.description == null || book.published_date == null) {
        color = "table-warning";
      }

      if (
        book.title == null ||
        book.authors === "n/a" ||
        book.thumbnail == null ||
        book.price == null
      ) {
        color = "table-danger";
      }

      book.color = color;
      return book;
    });
    res.render("scrap", data);
  },
  selectBookById: async (req, res, next) => {
    const id = req.params.id;

    try {
      const data = await dataMapper.selectBookById(id);

      res.render("editbook", { data });
    } catch (error) {
      console.log(error);
    }
  },
  updateBook: async (req, res, next) => {
    const data = req.body;

    const keysArray = Object.keys(data);

    for (const key of keysArray) {
      if (data[key] == "") {
        data[key] = null;
      }
    }

    try {
      await dataMapper.updateBook(data);
      res.json("ok");
    } catch (error) {
      console.log(error);
    }
  },
  deleteBook: async (req, res, next) => {
    const id = req.params.id;

    try {
      await dataMapper.deleteBook(id);
    } catch (error) {
      console.log(error);
    }

    res.redirect("/scrap");
  },
};
