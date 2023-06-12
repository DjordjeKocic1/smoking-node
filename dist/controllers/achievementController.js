"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementController = void 0;
const achievement_1 = __importDefault(require("../model/achievement"));
const user_1 = __importDefault(require("../model/user"));
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
        user_1.default.findOne({ _id: req.params.userId }).then((user) => {
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
            res
                .status(200)
                .json({ achievements: newAch.sort((a, b) => b.holding - a.holding) });
        });
    });
};
exports.achievementController = {
    createAchievement,
    getAchievemnts,
};
