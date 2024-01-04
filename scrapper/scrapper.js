const isbnDataMapper = require("../app/datamapper/isbnDataMapper");
const scrapDataMapper = require("./scrapDataMapper");
const apiDataMapper = require("./apiDataMapper");

const bookDataMapper = require("../app/datamapper/bookDataMapper");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const app = {
  uuid: uuidv4(),
  attendre: async (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // La promesse est résolue après une seconde
      }, time); // 1000 millisecondes équivalent à une seconde
    });
  },
  init: async () => {
    console.log("START SCRAP : " + app.uuid);
    try {
      const isbn = await isbnDataMapper.selectIsbnNotScrap();
      for (const book of isbn) {
        await app.loop(book);
      }
    } catch (error) {
      console.log(error);
    }
  },
  loop: async (book) => {
    console.log(``);
    console.log(
      `-----------------------------------------------------------------------`
    );
    console.log(
      `${book.id}- Livre: ${book.isbn} Box: ${book.box} - ${book.scan_date}`
    );
    console.log(
      `-----------------------------------------------------------------------`
    );

    try {
      const dataBook = await apiDataMapper.getBook(book.isbn);

      try {
        const chasse = await scrapDataMapper.getChasse(book.isbn);

        if (dataBook.title == null || dataBook.authors == null) {
          if (Object.entries(chasse).length !== 0) {
            dataBook.title = chasse.title;
            dataBook.authors = chasse.author;
          } else {
            dataBook.title = null;
            dataBook.authors = "na";
          }
        }

        dataBook.thumbnail = chasse.thumbnail;

        console.log(`Récupération du prix sur le site de recherche du livre`);
        dataBook.price = chasse.price;

      } catch (error) {
        console.log(error);
      }
     



      //ISBN
      dataBook.isbn = book.isbn;

      //DATE
      const new_published_date = dayjs(dataBook.published_date).format("YYYY");

      if (new_published_date != "Invalid Date") {
        dataBook.published_date = new_published_date;
      } else {
        dataBook.published_date = null;
      }

      // Si la miniature n'existe pas, on la récupère



      // On récupère le prix





      dataBook.format = null;
      dataBook.book_weight = null;
      dataBook.box = Number(book.box);
      dataBook.scan_date = book.scan_date;
      dataBook.id_scrap = app.uuid;

      const bookId = await bookDataMapper.insertBook(dataBook);
      const converted = await isbnDataMapper.updateIdConverted(book.id, bookId);


    } catch (error) {
      console.log(error);
    }
  },
};

app.init();
