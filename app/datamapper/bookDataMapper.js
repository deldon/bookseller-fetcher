const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./app/bdd/bdd.db");

const datamapper = {
insertBook: ({ 
  title, 
  authors, 
  thumbnail, 
  description, 
  published_date, 
  number_of_pages, 
  editor, 
  isbn, 
  price, 
  format, 
  book_weight, 
  box, 
  scan_date, 
  id_library 
}) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO book (
                title, 
                authors, 
                thumbnail, 
                description, 
                published_date, 
                number_of_pages, 
                editor, 
                isbn, 
                price, 
                format, 
                book_weight, 
                box, 
                scan_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
            [
                title,
                authors,
                thumbnail,
                description,
                published_date,
                number_of_pages,
                editor,
                isbn,
                price,
                format,
                book_weight,
                box,
                scan_date
            ],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`le book est save en bdd a l'ID: ${this.lastID}`);
                    resolve(this.lastID);
                }
            }
        );
    });
},
  selectBookNotFetch: () => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM book WHERE id_library IS NULL order by id desc",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },
  selectBookById: (id) => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM book WHERE id = ?", [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
    });
  },
  updateBook: ({
    id,
    title,
    authors,
    thumbnail,
    description,
    published_date,
    number_of_pages,
    editor,
    isbn,
    price,
    format,
    book_weight,
    box,
    scan_date,
    id_library
  }) => {

    const array =         [
      title,
      authors,
      thumbnail,
      description,
      published_date,
      number_of_pages,
      editor,
      isbn,
      price,
      format,
      book_weight,
      box,
      scan_date,
      id_library,
      id
    ]

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE book SET
          title = ?,
          authors = ?,
          thumbnail = ?,
          description = ?,
          published_date = ?,
          number_of_pages = ?,
          editor = ?,
          isbn = ?,
          price = ?,
          format = ?,
          book_weight = ?,
          box = ?,
          scan_date = ?,
          id_library = ?
        WHERE id = ?`,
array,
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`Le livre avec l'ID ${id} a été mis à jour en base de données.`);
            resolve();
          }
        }
      );
    });
  },
  deleteBook: (id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM book WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Book deleted with ID: ${id}`);
          resolve();
        }
      });
    });
  },
  

};

module.exports = datamapper;
