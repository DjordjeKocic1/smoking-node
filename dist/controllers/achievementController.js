"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementController = void 0;
const achievement_1 = __importDefault(require("../model/achievement"));
const createAchievement = (req, res) => {
    const achievement = new achievement_1.default({
        name: req.body.name,
        description: req.body.description,
        categorie: req.body.categorie,
        points: req.body.points,
        type: req.body.type,
    });
    achievement
        .save()
        .then((achievement) => res.status(201).json({ achievement }))
        .catch((error) => {
        res.status(502).json({ error });
    });
};
const getAchievemnts = (req, res, next) => {
    achievement_1.default.find().then((achievements) => {
        res.status(200).json({ achievements });
    });
};
exports.achievementController = {
    createAchievement,
    getAchievemnts,
};
