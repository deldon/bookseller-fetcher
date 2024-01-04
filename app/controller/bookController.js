const dataMapper = require("../datamapper/bookDataMapper");
const dayjs = require("dayjs");

module.exports = {
  selectBookNotFetch: async (req, res, next) => {
    let p = Number(req.query.p);
    let nbForP = 50;
    if (!p) {
      p = 0;
      nbForP = 50;
    }

    data = await dataMapper.selectBookNotFetch(p * nbForP, nbForP);
    data.page = {
      current: p,
      next: Number(p) + 1,
      pres: Number(p) - 1,
    };
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
    res.render("scrapImg", data);
  },

  selectBookFetch: async (req, res, next) => {
    data = await dataMapper.selectBookFetch();

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

  allIdScrap: async (req, res, next) => {
    data = await dataMapper.allIdScrap();
    console.log(data);
    res.render("scrapId", data);
  },

  allIdImport: async (req, res, next) => {
    data = await dataMapper.allIdImport();
    console.log(data);
    res.render("importId", data);
  },

  deleteIdScrap: async (req, res, next) => {
    const uuid = req.params.uuid;
    await dataMapper.updateIdScrap(uuid);
    await dataMapper.deleteIdScrap(uuid);

    res.redirect("/sid");
  },
  selectBookNotFetchError: async (req, res, next) => {
    const data = await dataMapper.selectBookNotFetch(0,-1);

    data.map((book) => {
      book.color = "table-danger";
      return book;
    });

    const nData = data.filter((book) => {
      return (
        book.title == null ||
        book.authors === "n/a" ||
        book.thumbnail == null ||
        book.price == null
      );
    });
    res.render("scrap", { data: nData });
  },
  selectBookById: async (req, res, next) => {
    const id = req.params.id;

    try {
      const book = await dataMapper.selectBookById(id);

      let color = "bg-light";

      if (book.description == null || book.published_date == null) {
        color = "bg-warning-subtle";
      }

      if (
        book.title == null ||
        book.authors === "n/a" ||
        book.thumbnail == null ||
        book.price == null
      ) {
        color = "bg-danger";
      }

      book.color = color;

      res.render("editbook", { data: book });
    } catch (error) {
      console.log(error);
    }
  },
  selectBookByScrapId: async (req, res, next) => {
    const id = req.params.id;

    data = await dataMapper.selectBookByScrapId(id);

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
