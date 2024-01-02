const bookDataMapper = require("../app/datamapper/bookDataMapper");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const app = {
  uuid:uuidv4(),
  url:"https://lireencore.fr/api/import",
  urls:"http://localhost:5001/import",
  post: async (body) => {
    const response = await fetch(app.url, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    return data;
  },
  init: async () => {
    try {
      const books = await bookDataMapper.selectBookNotFetch(0,-1);

      for (const book of books) {
        try {
          const response = await app.post(book);
         
          console.log('');
          console.log(`Le livre ${book.title} a bien etais ajouter`);

          try {
            await bookDataMapper.updateBookAddLibraryId(
              book.id,
              response.library_id,
              app.uuid
            );
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

app.init();
