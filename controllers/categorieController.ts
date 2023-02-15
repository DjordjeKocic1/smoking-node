import { Request, Response } from 'express';

import Categorie from "../model/categories";

const getCategories = (req:Request, res:Response) => {
  Categorie.find().then((categories) => {
    res.status(200).json({ categories });
  }).catch((error) => {
    console.log('Categories Get Error:',error);
    res.status(502).json({ error })
  });
};

const createCategories = (req:Request, res:Response) => {
  const categorie = new Categorie({
    name: req.body.name,
  });
  categorie
    .save()
    .then((categorie) => res.status(201).json({ categorie }))
    .catch((error) => {
      res.status(502).json({ error })
    });
};


export const categorieController = {
  getCategories,createCategories
}