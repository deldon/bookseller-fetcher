const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./app/bdd/bdd.db");

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS isbn;`);

  db.run(`CREATE TABLE IF NOT EXISTS isbn (
            id INTEGER PRIMARY KEY,
            isbn TEXT NOT NULL,
            box INT NOT NULL,
            scan_date TEXT NOT NULL,
            id_converted INT DEFAULT NULL)`);

  db.run(`DROP TABLE IF EXISTS book;`);

  db.run(`CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_scrap TEXT,
    id_import TEXT,
    title TEXT,
    authors TEXT,
    thumbnail TEXT,
    description TEXT,
    published_date TEXT,
    number_of_pages TEXT,
    editor TEXT,
    isbn TEXT,
    price TEXT,
    format TEXT,
    book_weight TEXT,
    box INTEGER,
    scan_date TEXT,
    id_library INTEGER
);`);
});

console.log('-> init sql');

// Fermer la connexion après la création de la table
db.close();
