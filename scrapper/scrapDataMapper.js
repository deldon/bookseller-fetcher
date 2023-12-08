const puppeteer = require("puppeteer");
const csv = require("csvtojson");

module.exports = {
  getPrice: async (isbn) => {
    const browser = await puppeteer.launch({ headless: "new" }); // Ouvre un navigateur headless
    const page = await browser.newPage(); // Ouvre une nouvelle page

    await page.goto("https://www.chasse-aux-livres.fr/estimation-de-livres"); // Navigue vers une URL

    const elementId = "isbns-form-textarea"; // Remplacez par l'ID de l'élément que vous souhaitez sélectionner.

    const textareaElement = await page.$(`#${elementId}`);

    if (textareaElement) {
      // L'élément textarea a été trouvé par son ID.
      await textareaElement.click(); // Cliquez sur le textarea pour le mettre en surbrillance.
      await page.keyboard.type(isbn); // Écrivez le contenu.

      // Pour enregistrer une capture d'écran avec le contenu écrit, vous pouvez ajouter :
      // await page.screenshot({ path: 'capture.png' });
    } else {
      console.log(`Élément avec l'ID ${elementId} non trouvé.`);
    }

    const buttonId = "isbns-form-submit"; // Remplacez par l'ID du bouton que vous souhaitez cliquer.
    await page.click(`#${buttonId}`);

    await page.waitForSelector("#prices-table");

    await page.waitForSelector("#table-resume > textarea", {
      visible: true,
      timeout: 200,
    }); // Vous pouvez ajuster le sélecteur et le timeout selon vos besoins.

    const textareaValue = await page.$eval(
      "#table-resume > textarea",
      (textarea) => textarea.value
    );
    // console.log(textareaValue);
    await browser.close();

    try {
      const jsonArray = await csv({
        noheader: true,
        delimiter: "auto",
      }).fromString(textareaValue);

      return jsonArray
        .map((e) => {
          return {
            last: e.field2,
            moy: e.field3,
          };
        })
        .slice(1);
    } catch (error) {
      console.error(error);
    }
  },
  getThumbnail: async (isbn) => {
    let imgUrl = null;
    const browser = await puppeteer.launch({ headless: "new" }); // Ouvre un navigateur headless
    const page = await browser.newPage(); // Ouvre une nouvelle page

    await page.goto("https://www.chasse-aux-livres.fr/estimation-de-livres"); // Navigue vers une URL

    const elementId = "isbns-form-textarea"; // Remplacez par l'ID de l'élément que vous souhaitez sélectionner.

    const textareaElement = await page.$(`#${elementId}`);

    if (textareaElement) {
      // L'élément textarea a été trouvé par son ID.
      await textareaElement.click(); // Cliquez sur le textarea pour le mettre en surbrillance.
      await page.keyboard.type(isbn); // Écrivez le contenu.

      // Pour enregistrer une capture d'écran avec le contenu écrit, vous pouvez ajouter :
      // await page.screenshot({ path: 'capture.png' });
    } else {
      console.log(`Élément avec l'ID ${elementId} non trouvé.`);
    }

    const buttonId = "isbns-form-submit"; // Remplacez par l'ID du bouton que vous souhaitez cliquer.
    await page.click(`#${buttonId}`);

    //await page.waitForTimeout(5000); // Attendez 3 secondes.

    try {
      // Attendez que l'élément avec le sélecteur '.votre-selecteur' soit chargé dans la page.
      await page.waitForSelector("#prices-table", {
        visible: true,
        timeout: 200,
      }); // Vous pouvez ajuster le sélecteur et le timeout selon vos besoins.

      // console.log('Élément chargé !');

      const imageURL = await page.evaluate(() => {
        const image = document.querySelector(
          "#prices-table > tbody > tr > td:nth-child(1) > a:nth-child(1) > img"
        );
        return image ? image.src : null;
      });

      imgUrl = imageURL.split("?")[0];
      // console.log('URL de l\'image :', imageURL.split('?')[0]);
    } catch (error) {
      console.error(
        "L'élément n'a pas été trouvé ou n'a pas été chargé dans le délai imparti."
      );
    }

    //#prices-table > tbody > tr > td:nth-child(1) > a:nth-child(1)

    await browser.close();
    return imgUrl;
  },
  getInfo: async (isbn) => {
    const info = {};

    console.log("ok");
    const browser = await puppeteer.launch({ headless: false }); // Ouvre un navigateur headless
    const page = await browser.newPage(); // Ouvre une nouvelle page

    await page.goto("https://www.chasse-aux-livres.fr/estimation-de-livres"); // Navigue vers une URL

    const elementId = "isbns-form-textarea"; // Remplacez par l'ID de l'élément que vous souhaitez sélectionner.

    const textareaElement = await page.$(`#${elementId}`);

    if (textareaElement) {
      // L'élément textarea a été trouvé par son ID.
      await textareaElement.click(); // Cliquez sur le textarea pour le mettre en surbrillance.
      await page.keyboard.type(isbn); // Écrivez le contenu.

      // Pour enregistrer une capture d'écran avec le contenu écrit, vous pouvez ajouter :
      // await page.screenshot({ path: 'capture.png' });
    } else {
      console.log(`Élément avec l'ID ${elementId} non trouvé.`);
    }

    const buttonId = "isbns-form-submit"; // Remplacez par l'ID du bouton que vous souhaitez cliquer.
    await page.click(`#${buttonId}`);

    //await page.waitForTimeout(5000); // Attendez 3 secondes.

    try {
      // Attendez que l'élément avec le sélecteur '.votre-selecteur' soit chargé dans la page.
      await page.waitForSelector("#prices-table", {
        visible: true,
        timeout: 200,
      }); // Vous pouvez ajuster le sélecteur et le timeout selon vos besoins.

      // console.log('Élément chargé !');

      const imageURL = await page.evaluate(() => {
        const image = document.querySelector(
          "#prices-table > tbody > tr > td:nth-child(1) > a.ean-link"
        );
        return image ? image.href : null;
      });
      console.log(imageURL);
      const page2 = await browser.newPage(); // Ouvre une nouvelle page
      await page2.goto(imageURL); // Navigue vers une URL

 




      title = await page2.$eval(
        "#book-title-and-details > div:nth-child(1) > h1.d-block.d-lg-none",
        (element) => element.textContent
      );
      console.log(title);

      author = await page2.$eval(
        "#creators > span > a",
        (element) => element.textContent
      );

      info.title = title;
      info.author = author;
      
    } catch (error) {
      console.error(
        "L'élément n'a pas été trouvé ou n'a pas été chargé dans le délai imparti."
      );
    }

    await browser.close();

    return info
   
  },
};

//https://www.chasse-aux-livres.fr/search?query=9782253005360&catalog=fr

//9782253005360
