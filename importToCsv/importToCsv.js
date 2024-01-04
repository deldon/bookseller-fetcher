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
      let books = await app.read("./importToCsv/books-01-01-24.csv");


     books = books.filter((e) => e.date == '16/12/23');

   
      for (const book of books) {



        const nBook = {
            isbn:book.isbn,
            box:book.box,
            scan_date:book.date
        }
        console.log(nBook);
        
        await datamapper.insertIsbn(nBook)
      }


   
    } catch (error) {
      console.log(error);
    }
  },
};

app.init();


