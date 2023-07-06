import { NextFunction, Request, Response } from 'express';

import Categorie from "../model/categories";

const getCategories = (req:Request, res:Response,next:NextFunction) => {
  Categorie.find().then((categories) => {
    res.status(200).json({ categories });
  }).catch((error) => {
    next(error)
  });
};

const createCategories = (req:Request, res:Response,next:NextFunction) => {
  const categorie = new Categorie({
    name: req.body.name,
  });
  categorie
    .save()
    .then((categorie) => res.status(201).json({ categorie }))
    .catch((error) => {
      next(error)
    });
};


export const categorieController = {
  getCategories,createCategories
}