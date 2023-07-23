import { NextFunction, Request, RequestHandler, Response } from "express";

import Categorie from "../model/categories";
import { ICategorie } from "../types/types";

const getCategories: RequestHandler = async (req, res, next) => {
  try {
    let categories = await Categorie.find();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

const createCategories: RequestHandler = async (req, res, next) => {
  try {
    const categorie = new Categorie({
      name: req.body.name,
    });
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
