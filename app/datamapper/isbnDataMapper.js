const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./app/bdd/bdd.db");

const datamapper = {
  insertIsbn: ({ isbn, box, scan_date }) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO isbn (isbn, box, scan_date) VALUES (?, ?, ?) RETURNING *",
        [isbn, box, scan_date],
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`Row inserted with ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });
  },
  selectIsbnNotScrap: () => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id ,isbn, box, scan_date FROM isbn WHERE id_converted IS NULL order by id desc",
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
  selectIsbnScrap: () => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id ,isbn, box, scan_date FROM isbn WHERE id_converted IS NOT NULL order by id desc",
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
  selectIsbnById: (id) => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM isbn WHERE id = ?", [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
    });
  },

  deleteIsbn: (id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM isbn WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Row deleted with ID: ${id}`);
          resolve();
        }
      });
    });
  },
  update: ({ id, isbn, box, scanDate, id_converted }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE isbn
            SET isbn = ?, box = ?, scan_date = ?, id_converted = ?
            WHERE id = ?;`,
        [isbn, box, scanDate, id_converted, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`Row updated with ID ${id}.`);
            resolve();
          }
        }
      );
    });
  },

  updateIdConverted: (id, id_converted ) => {

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE isbn
          SET id_converted = ?
          WHERE id = ?;`,
        [id_converted, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`l'id: ${id} a etais enregistes dans la table isbn`);
            resolve();
          }
        }
      );
    });
  },
};

module.exports = datamapper;
