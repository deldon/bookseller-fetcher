const fetch = require("node-fetch");

isbnDataMapper = {
  fetchBookInfoGoogle: async (isbn) => {
    try {
      // URL de l'API Google Books
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

      // Effectuer la requête GET à l'API Google Books
      const response = await fetch(apiUrl);

      const data = await response.json();

      // Vérifier si des résultats ont été renvoyés
      if (data.totalItems > 0) {
        // Récupérer les informations du premier livre trouvé
        return {
          error: false,
          data: data.items[0],
        };

        // return bookInfo
      } else {
        //  console.log("Aucun livre trouvé pour cet ISBN.");
        return {
          error: true,
          isbn,
          data: "Aucun livre trouvé pour cet ISBN cher google",
        };
      }
    } catch (error) {
      //  console.error("Erreur lors de la requête à l'API Google Books: " + error);
      return {
        error: true,
        isbn,
        data: "Erreur lors de la requête à l'API Google Books: " + error,
      };
    }
  },
  fetchBookOpenLib: async (isbn) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
      );

      const data = await response.json();
      const bookInfo = data[`ISBN:${isbn}`];

      if (bookInfo) {
        //console.log('Informations sur le livre :', bookInfo);

        return {
          error: false,
          data: bookInfo,
        };
      } else {
        //console.log('Aucun livre trouvé pour cet ISBN. chez openlibrary.org');
        return {
          error: true,
          data: "Aucun livre trouvé pour cet ISBN chez openlibrary.org ",
        };
      }
    } catch (error) {
      // console.error("Erreur lors de la requête à l'API Google Books: " + error);
      return {
        error: true,
        data: "Erreur lors de la requête à l'API Google Books: " + error,
      };
    }
  },

  getBook: async (isbn) => {
    const googleBook = await isbnDataMapper.fetchBookInfoGoogle(isbn);
    const openBook = await isbnDataMapper.fetchBookOpenLib(isbn);

    const googleIsOk = !googleBook.error;
    const openIsOk = !openBook.error;
    console.log(`GoogleApi ${googleIsOk} - openlibraryApi ${openIsOk}`);

    const books = {
      title: null,
      authors: null,
      thumbnail: null,
      description: null,
      published_date: null,
      number_of_pages: null,
      editor: null,
    };

    if (googleIsOk || openIsOk) {
      // TITLE
      if (googleIsOk && googleBook.data.volumeInfo.title) {
        books.title = googleBook.data.volumeInfo.title;
      } else if (openIsOk && openBook.data.title) {
        books.title = openBook.data.title;
      }

      //AUTHORS
      if (googleIsOk && googleBook.data.volumeInfo.authors) {
        books.authors = googleBook.data.volumeInfo.authors[0];
      } else if (openIsOk && openBook.data.authors) {
        books.authors = openBook.data.authors[0].name;
      }

      //THUMBNAIL
      if (openIsOk && openBook.data.cover) {
        books.thumbnail = openBook.data.cover.large;
      } else if (googleIsOk && googleBook.data.imageLinks) {
        books.thumbnail = googleBook.data.volumeInfo.imageLinks.thumbnail;
      }

      //DESCRIPTION
      if (googleIsOk && googleBook.data.volumeInfo) {
        if (googleBook.data.volumeInfo.description) {
          books.description = googleBook.data.volumeInfo.description;
        } else {
          if (googleBook.data.searchInfo) {
            books.description = googleBook.data.searchInfo.textSnippet;
          } else {
            if (googleBook.data.volumeInfo.subtitle) {
              books.description = googleBook.data.volumeInfo.subtitle;
            }
          }
        }
      } else if (openIsOk && openBook.data.subtitle) {
        books.description = openBook.data.subtitle;
      }

      //number_of_pages

      if (googleIsOk) {
        if (googleBook.data.volumeInfo.pageCount) {
          books.number_of_pages = googleBook.data.volumeInfo.pageCount;
        } else {
          if (openBook.data.number_of_pages) {
            books.number_of_pages = openBook.data.number_of_pages;
          } else {
            books.number_of_pages = 0;
          }
        }
      } else {
        if (openBook.data.number_of_pages) {
          books.number_of_pages = openBook.data.number_of_pages;
        } else {
          books.number_of_pages = 0;
        }
      }

      //DATE

      if (googleIsOk && googleBook.data.volumeInfo.publishedDate) {
        books.published_date = googleBook.data.volumeInfo.publishedDate;
      } else if (openIsOk && openBook.data.publish_date) {
        books.published_date = openBook.data.publish_date;
      }

      //CATEGORIE

      // if (openIsOk && openBook.data.subjects) {
      //   books.gender = openBook.data.subjects.map((e) => e.name);
      // } else if (googleIsOk && googleBook.data.volumeInfo.categories) {
      //   books.gender = googleBook.data.volumeInfo.categories;
      // }

      //EDITOR
      if (googleIsOk && googleBook.data.volumeInfo.publisher) {
        books.editor = googleBook.data.volumeInfo.publisher;
      } else if (openIsOk && openBook.data.publishers) {
        books.editor = openBook.data.publishers[0].name;
      }

      return books;
    } else {
      return books;
    }
  },
};

module.exports = isbnDataMapper;
