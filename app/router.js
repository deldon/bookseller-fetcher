
const express = require('express');
const bookController = require('./controller/bookController');
const router = express.Router();

const mainController = require("./controller/homeController");
const isbnController = require('./controller/isbnController');

router.get("/",mainController.getHome);
router.get("/isbn/noscrap",mainController.selectIsbnNotScrap)
router.post("/isbn/",mainController.inputIsbn);


router.get("/isbn/:id",isbnController.selectIsbnById)
router.get("/isbn/delete/:id",isbnController.deleteIsbn)
router.post("/isbn/update", isbnController.updateIsbn)

router.get("/scrap",bookController.selectBookNotFetch)
router.get("/scrap/:id",bookController.selectBookById)
router.post("/book/update", bookController.updateBook)
router.get("/book/delete/:id",bookController.deleteBook)

module.exports = router;