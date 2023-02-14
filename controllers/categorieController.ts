import Categorie from "../model/categories";

const getCategories = (req:any, res:any) => {
  Categorie.find().then((categories) => {
    res.status(200).json({ categories });
  });
};

const createCategories = (req:any, res:any) => {
  const categorie = new Categorie({
    name: req.body.name,
  });
  categorie
    .save()
    .then((categorie) => res.status(201).json({ categorie }))
    .catch((error) => res.status(502).json({ error }));
};


export const categorieController = {
  getCategories,createCategories
}