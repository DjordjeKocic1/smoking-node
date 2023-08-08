"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementController = void 0;
const achievement_1 = __importDefault(require("../model/achievement"));
const user_1 = __importDefault(require("../model/user"));
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const createAchievement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const achievement = new achievement_1.default({
            name: req.body.name,
            description: req.body.description,
            categorie: req.body.categorie,
            points: req.body.points,
            type: req.body.type,
            tag: req.body.tag,
        });
        let achievementSaved = yield achievement.save();
        res.status(201).json({ achievement: achievementSaved });
    }
    catch (error) {
        next(error);
    }
});
const getAchievemnts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let achievements = (yield achievement_1.default.find());
        let user = (yield user_1.default.findOne({ _id: req.params.id }));
        let userCompletedTasks = user.tasks.filter((v) => v.status == "done");
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
                    !!userCompletedTasks.length &&
                    userCompletedTasks.length >= achs.tag &&
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
            user.achievements = newAch;
            yield user.save();
            res.status(200).json({
                achievements: newAch.sort((a, b) => b.holding - a.holding),
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.achievementController = {
    createAchievement,
    getAchievemnts,
};
