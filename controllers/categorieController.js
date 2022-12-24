const Categorie = require("../model/categories");

exports.getCategories = (req, res, next) => {
  Categorie.find().then((categories) => {
    res.json({ categories });
  });
};

exports.createCategories = (req, res, next) => {
  const categorie = new Categorie({
    name: req.body.name,
  });
  categorie
    .save()
    .then((categorie) => res.json({ categorie }))
    .catch((error) => res.json({ error }));
};
