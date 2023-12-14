const datamapper = require("../app/datamapper/isbnDataMapper");
const csvParser = require("./csvParser");
const fs = require("fs");
const csv = require("csv-parser");

const app = {
    read: (filePath) => {
        return new Promise((resolve, reject) => {
          const results = [];
          const stream = fs.createReadStream(filePath);
          stream
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
        });
      },
    
  init: async () => {
    try {
      let books = await app.read("./importToCsv/books-30-11-23.csv");

      books = books.filter((e) => e.box == 120);


      for (const book of books) {

        const nBook = {
            isbn:book.isbn,
            box:book.box,
            scan_date:book.date
        }
        
        await datamapper.insertIsbn(nBook)
      }


   
    } catch (error) {
      console.log(error);
    }
  },
};

app.init();


