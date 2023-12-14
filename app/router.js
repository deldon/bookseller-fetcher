
const express = require('express');
const bookController = require('./controller/bookController');
const router = express.Router();

const mainController = require("./controller/homeController");
const isbnController = require('./controller/isbnController');
const scrapController = require('./controller/scrapController');

router.get("/",mainController.getHome);
router.get("/isbn/noscrap",mainController.selectIsbnNotScrap)
router.get("/isbn/scrap",isbnController.getIsbnScrap)
router.post("/isbn/",mainController.inputIsbn);


router.get("/isbn/:id",isbnController.selectIsbnById)
router.get("/isbn/delete/:id",isbnController.deleteIsbn)
router.post("/isbn/update", isbnController.updateIsbn)

router.get("/scrap",bookController.selectBookNotFetch)
router.get("/scrap/not",bookController.selectBookFetch)
router.get("/serror",bookController.selectBookNotFetchError)
router.get("/scrap/:id",bookController.selectBookById)
router.post("/book/update", bookController.updateBook)
router.get("/book/delete/:id",bookController.deleteBook)
router.get("/sid/",bookController.allIdScrap)
router.get("/sid/:id",bookController.selectBookByScrapId)
router.get("/sid/delete/:uuid",bookController.deleteIdScrap)
router.get("/import/",bookController.allIdImport)

router.get("/scrap/thumbnail/:isbn",scrapController.fetchThumbnail)
router.get("/scrap/price/:isbn",scrapController.fetchPrice)

module.exports = router;