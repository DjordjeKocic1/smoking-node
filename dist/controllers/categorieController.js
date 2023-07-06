"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorieController = void 0;
const categories_1 = __importDefault(require("../model/categories"));
const getCategories = (req, res, next) => {
    categories_1.default.find().then((categories) => {
        res.status(200).json({ categories });
    }).catch((error) => {
        next(error);
    });
};
const createCategories = (req, res, next) => {
    const categorie = new categories_1.default({
        name: req.body.name,
    });
    categorie
        .save()
        .then((categorie) => res.status(201).json({ categorie }))
        .catch((error) => {
        next(error);
    });
};
exports.categorieController = {
    getCategories, createCategories
};
