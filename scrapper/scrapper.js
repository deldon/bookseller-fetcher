const isbnDataMapper = require("../app/datamapper/isbnDataMapper");
const scrapDataMapper = require("./scrapDataMapper");
const apiDataMapper = require("./apiDataMapper");

const bookDataMapper = require("../app/datamapper/bookDataMapper")
const dayjs = require("dayjs");

const app = {
    attendre: async (time) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(); // La promesse est résolue après une seconde
          }, time); // 1000 millisecondes équivalent à une seconde
        });
      },
  init: async () => {
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

      if (dataBook.title == null || dataBook.authors == null) {
        const info = await scrapDataMapper.getInfo(book.isbn);

        if (Object.entries(info).length !== 0) {
          dataBook.title = info.title;
          dataBook.authors = info.author;
        } else {
          dataBook.title = null;
          dataBook.authors = "n/a";
        }
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
      if (dataBook.thumbnail == null) {
        try {
          const newThumbnail = await scrapDataMapper.getThumbnail(book.isbn);

          console.log(
            `Récupération de la miniature sur le site de recherche du livre`
          );
          dataBook.thumbnail = newThumbnail;
        } catch (error) {
          console.log(`Erreur sur le site de recherche du livre : ${error}`);
        }
      }

      // On récupère le prix
      try {
        const price = await scrapDataMapper.getPrice(book.isbn);
        console.log(`Récupération du prix sur le site de recherche du livre`);
        dataBook.price = Number(price[0].moy.replace(",", "."));
      } catch (error) {
        console.log(
          `Erreur sur le prix sur le site de recherche du livre : ${error}`
        );
      }

      dataBook.format = null;
      dataBook.book_weight = null;
      dataBook.box = Number(book.box);
      dataBook.scan_date = book.scan_date;



      const bookId = await bookDataMapper.insertBook(dataBook)
      const converted = await isbnDataMapper.updateIdConverted(book.id,bookId)


    } catch (error) {
      console.log(error);
    }
  },
};

app.init();
