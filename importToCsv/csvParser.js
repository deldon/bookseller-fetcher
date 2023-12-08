const fs = require("fs");
const csv = require("csv-parser");

const csvParser = {
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

  
};

module.exports = csvParser;
