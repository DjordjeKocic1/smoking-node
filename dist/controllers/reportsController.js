"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = void 0;
const user_1 = __importDefault(require("../model/user"));
const getAllVerifyUsers = (req, res, next) => {
    user_1.default.find({ userVerified: true }).then((user) => {
        res.status(200).json({ verifyUsers: user });
    });
};
const getAllUsersByCategorie = (req, res, next) => {
    let categorieName = req.params.name;
    let arr = [];
    user_1.default.find({ userVerified: true })
        .then((user) => {
        user.forEach((u) => {
            var _a;
            (_a = u.categories) === null || _a === void 0 ? void 0 : _a.map((cat) => {
                if (cat.name == categorieName) {
                    arr.push({
                        email: u.email,
                        name: u.name,
                        verified: u.userVerified,
                        categorie: categorieName,
                    });
                }
            });
        });
        if ((arr === null || arr === void 0 ? void 0 : arr.length) == 0) {
            return res.status(200).json({
                users: "User with that categorie name is not in database",
            });
        }
        res.status(200).json({ users: arr });
    })
        .catch((err) => console.log(err));
};
exports.reportsController = {
    getAllVerifyUsers,
    getAllUsersByCategorie,
};
