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
exports.userController = void 0;
const mentor_1 = __importDefault(require("../model/mentor"));
const user_1 = __importDefault(require("../model/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const notifications_1 = require("../helpers/notifications/notifications");
const errorHandler_1 = require("../errors/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const { SESSION_SECRET } = process.env;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findOne({ email: req.body.email }));
        res
            .status(200)
            .json({ user, redirect: "/account/delete/request?id=" + user._id });
    }
    catch (error) {
        next(error);
    }
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let users = yield user_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        next(error);
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let token = jsonwebtoken_1.default.sign({ email: req.body.email }, SESSION_SECRET, {
            expiresIn: "30d",
        });
        let existingUser = yield user_1.default.findOne({ email: req.body.email });
        if (!existingUser) {
            const user = new user_1.default({
                name: req.body.name,
                email: req.body.email,
                image: req.body.image,
                address: req.body.address,
                city: req.body.city,
            });
            let userCreate = yield user.save();
            res.status(201).json({ user: userCreate });
            return;
        }
        res.status(201).json({ user: existingUser, token });
    }
    catch (error) {
        next(error);
    }
});
const creatUserWithPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let token = jsonwebtoken_1.default.verify(req.header("Authorization"), process.env.SESSION_SECRET);
        let email = token.email;
        let password = yield bcryptjs_1.default.hash(req.body.password.replace(" ", ""), 12);
        let existingUser = yield user_1.default.findOne({ email });
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.roles) === "admin") {
            existingUser.password = password;
            yield existingUser.save();
            res.json({ redirect: "/admin/login" });
            return;
        }
        if (!existingUser) {
            const user = new user_1.default({
                email,
                password: password,
            });
            let userCreate = yield user.save();
            res.status(201).json({ user: userCreate });
            return;
        }
        existingUser.password = password;
        yield existingUser.save();
        res.status(201).json({ user: existingUser });
    }
    catch (error) {
        next(error);
    }
});
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let token = jsonwebtoken_1.default.sign({ email: req.body.email }, SESSION_SECRET, {
            expiresIn: "30d",
        });
        let userFind = (yield user_1.default.findOne({ email: req.body.email }));
        let passwordCompare = yield bcryptjs_1.default.compare(req.body.password.replace(" ", ""), userFind.password);
        if (!passwordCompare) {
            throw new errorHandler_1.http422Error("Wrong password");
        }
        yield userFind.save();
        res.status(201).json({
            user: {
                email: userFind.email,
                userVerified: userFind.userVerified,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }));
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        yield user_1.default.findOneAndDelete({ _id: req.params.id });
        let mentorDeleteId = yield mentor_1.default.findOne({ userId: req.params.id });
        if (mentorDeleteId) {
            yield mentorDeleteId.remove();
        }
        let mentors = yield mentor_1.default.find();
        for (const mentor of mentors) {
            let findMentoringUser = mentor.mentoringUser.find((m) => { var _a; return ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.id; });
            if (findMentoringUser) {
                let filtered = mentor.mentoringUser.filter((m) => { var _a, _b; return ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = findMentoringUser === null || findMentoringUser === void 0 ? void 0 : findMentoringUser._id) === null || _b === void 0 ? void 0 : _b.toString()); });
                mentor.mentoringUser = filtered;
                yield mentor.save();
            }
        }
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
const updateUserNotificationToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let userUpdate = (yield user_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }));
        res.status(201).json({ user: userUpdate });
    }
    catch (error) {
        next(error);
    }
});
const updateUserConsumption = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findById(req.params.id));
        let userInfoCalc;
        if (!req.body.consumptionInfo) {
            userInfoCalc = yield user.calculateHealth(user, user.consumptionInfo);
        }
        else {
            userInfoCalc = yield user.calculateHealth(user, req.body);
        }
        res.status(201).json({ user: userInfoCalc });
    }
    catch (error) {
        next(error);
    }
});
const pokeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notifications_1.expoNotification.sendPushNotification({
            to: req.body.notificationToken,
            title: `Poked by ${req.body.name}`,
            body: "You just received a poke from mentor 👈",
        });
        res.status(201).json({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
const sendNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notifications_1.expoNotification.sendPushNotification({
            to: req.body.notificationToken,
            title: req.body.title,
            body: req.body.body,
        });
        res.status(201).json({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.userController = {
    getUsers,
    getUser,
    updateUserConsumption,
    createUser,
    creatUserWithPassword,
    userLogin,
    updateUser,
    deleteUser,
    pokeUser,
    sendNotification,
    updateUserNotificationToken,
};
