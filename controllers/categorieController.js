const Categorie = require("../model/categories");

exports.getCategories = (req, res, next) => {
  Categorie.find().then((categories) => {
    res.status(200).json({ categories });
  });
};

exports.createCategories = (req, res, next) => {
  const categorie = new Categorie({
    name: req.body.name,
  });
  categorie
    .save()
    .then((categorie) => res.status(201).json({ categorie }))
    .catch((error) => res.status(502).json({ error }));
};
