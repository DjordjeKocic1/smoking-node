"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementController = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const achievement_1 = __importDefault(require("../model/achievement"));
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
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
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http422Error(errors.array()[0].msg);
    }
    achievement_1.default.find()
        .then((achievements) => {
        user_1.default.findOne({ _id: req.params.id })
            .then((user) => {
            let newAch = achievements.map((achs) => {
                switch (true) {
                    case (user === null || user === void 0 ? void 0 : user.consumptionInfo.cigarettesAvoided) >= achs.tag &&
                        achs.categorie == "cigarettesAvoided":
                        return Object.assign(Object.assign({}, achs._doc), { holding: true });
                    case !!(user === null || user === void 0 ? void 0 : user.smokingInfo) &&
                        (user === null || user === void 0 ? void 0 : user.smokingInfo.noSmokingDays) >= achs.tag &&
                        achs.categorie == "noSmokingDays":
                        return Object.assign(Object.assign({}, achs._doc), { holding: true });
                    case !!(user === null || user === void 0 ? void 0 : user.tasks) &&
                        (user === null || user === void 0 ? void 0 : user.tasks.length) >= achs.tag &&
                        achs.categorie == "tasks":
                        return Object.assign(Object.assign({}, achs._doc), { holding: true });
                    case !!(user === null || user === void 0 ? void 0 : user.healthInfo) &&
                        (user === null || user === void 0 ? void 0 : user.healthInfo.avgHealth) >= achs.tag &&
                        achs.categorie == "avgHealth":
                        return Object.assign(Object.assign({}, achs._doc), { holding: true });
                    default:
                        return Object.assign(Object.assign({}, achs._doc), { holding: false });
                }
            });
            if (newAch.length != 0) {
                let achievementHold = newAch.filter((v) => {
                    if (v.holding) {
                        return v;
                    }
                });
                user.achievements = achievementHold;
                user.save();
                res
                    .status(200)
                    .json({
                    achievements: achievementHold.sort((a, b) => b.holding - a.holding),
                });
            }
        })
            .catch(() => {
            next(new errorHandler_1.http500Error());
        });
    })
        .catch(() => {
        next(new errorHandler_1.http500Error());
    });
};
exports.achievementController = {
    createAchievement,
    getAchievemnts,
};
