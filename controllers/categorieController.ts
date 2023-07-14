import { NextFunction, Request, Response } from "express";

import Categorie from "../model/categories";

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let categories = await Categorie.find();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

const createCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categorie = new Categorie({
    name: req.body.name,
  });
  try {
    let categorieCreate = await categorie.save();
    res.status(201).json({ categorie: categorieCreate });
  } catch (error) {
    next(error);
  }
};

export const categorieController = {
  getCategories,
  createCategories,
};
