const { Builder, By, Key, until } = require("selenium-webdriver");
const csv = require("csvtojson");


module.exports = {
  getChasse: async (isbn) => {
    const driver = new Builder().forBrowser("chrome").build();
    try {
     
      await driver.get("https://www.chasse-aux-livres.fr/");

      const monBouton = await driver.findElement(By.id("dashboard-top-link"));
      await monBouton.click();

      const email = await driver.findElement(By.id("email"));
      await email.sendKeys("r.deldon@gmail.com");

      const password = await driver.findElement(By.id("password"));
      await password.sendKeys("z88csf");

      const submit = await driver.findElement(
        By.xpath('//*[@id="login"]/button')
      );
      await submit.click();

      const home = await driver.findElement(
        By.xpath('//*[@id="logo-top"]/img[1]')
      );
      await home.click();

      const estim = await driver.findElement(
        By.xpath('//*[@id="navbarSupportedContent"]/ul/li[6]/a')
      );
      await estim.click();

      const textarea = await driver.findElement(
        By.xpath('//*[@id="isbns-form-textarea"]')
      );
      await textarea.sendKeys(isbn);

      const estimSub = await driver.findElement(
        By.xpath('//*[@id="isbns-form-submit"]')
      );
      await estimSub.click();

      const textareaXPath = '//*[@id="table-resume"]/textarea'; // Remplacez par votre propre XPath
      const textareaElement = await driver.wait(
        until.elementLocated(By.xpath(textareaXPath)),
        10000
      );

      // Attendre que le textarea soit visible
      await driver.wait(until.elementIsVisible(textareaElement), 10000);

      // Récupérer le contenu du textarea
      const contenuTextarea = await textareaElement.getAttribute("value");

      const trumbnail = await driver.findElement(
        By.xpath('//*[@id="prices-table"]/tbody/tr/td[1]/a[1]/img')
      );

      const thumbnail = await trumbnail.getAttribute("src");

      const links = await driver.findElement(
        By.xpath('//*[@id="prices-table"]/tbody/tr/td[1]/a[1]')
      );

      const link = await links.getAttribute("href");


      await driver.get(link);

      const bookTitle = await driver.findElement(
        By.xpath('//*[@id="book-title-and-details"]/div[1]/h1[1]')
      );

      const title = await bookTitle.getText();

      const bookAuthor = await driver.findElement(
        By.xpath('//*[@id="creators"]/span/a')
      );

      const author = await bookAuthor.getText();
      await driver.quit();


      const data = {};

      data.title = title;
      data.author = author;
      data.thumbnail = thumbnail.split("?")[0];
      try {
        const jsonArray = await csv({
          noheader: true,
          delimiter: "auto",
        }).fromString(contenuTextarea);

        data.price = Number(jsonArray[1].field3.replace(/,/g, "."));
      } catch (error) {
        console.error(error);
      }

      return data;
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
    }
  }
};