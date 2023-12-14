const datamapper = require("../datamapper/isbnDataMapper");
const dayjs = require("dayjs");

module.exports = {
  getIsbn: async (req, res, next) => {
    data = await datamapper.selectIsbnNotScrap();

    res.render("isbn", data);
  },
  getIsbnScrap: async (req, res, next) => {
    data = await datamapper.selectIsbnScrap()
    res.render("isbnScrapped", data);
  },
  deleteIsbn: async (req, res, next) => {
    const id = req.params.id;

    try {
      await datamapper.deleteIsbn(id);
    } catch (error) {
      console.log(error);
    }

    res.redirect("/");
  },

  selectIsbnById: async (req,res,next) =>{
    const id = req.params.id;

    try {
      const data = await datamapper.selectIsbnById(id)
      res.render('editisbn',{data})
    } catch (error) {
      console.log(error);
    }

   
  },
  updateIsbn: async (req, res, next) => {
    const data = req.body;

    if (data.id_converted == '') {
      data.id_converted = null
    }

  

    try {
      await datamapper.update(data)
      res.json('ok')
    } catch (error) {
      console.log(error);
    }

    
  }
};
