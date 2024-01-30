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
const errorHandler_1 = require("../errors/errorHandler");
const mentor_1 = __importDefault(require("../model/mentor"));
const plans_1 = __importDefault(require("../model/plans"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const express_validator_1 = require("express-validator");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield user_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        next(error);
    }
});
const getUserNotificationToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
const getUserHealth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findById(req.params.id));
        let healthCalc = yield user.calculateHealth(user);
        res.status(201).json({ user: healthCalc });
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
        const user = new user_1.default({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
            address: req.body.address,
            city: req.body.city,
        });
        let users = yield user_1.default.find();
        let existingUser = users.find((user) => user.email == req.body.email);
        if (!!existingUser) {
            return res.status(201).json({ user: existingUser });
        }
        let userCreate = yield user.save();
        res.status(201).json({ user: userCreate });
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
const updateUserCosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http500Error();
        }
        const user = (yield user_1.default.findById(req.params.id));
        let userCost;
        if (!req.body.consumptionInfo) {
            userCost = yield user.calculateCosts(user.consumptionInfo);
        }
        else {
            userCost = yield user.calculateCosts(req === null || req === void 0 ? void 0 : req.body);
        }
        res.status(201).json({ user: userCost });
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
        let userDeleted = yield user_1.default.findByIdAndDelete({ _id: req.params.id });
        yield mentor_1.default.findByIdAndDelete({ mentorId: userDeleted === null || userDeleted === void 0 ? void 0 : userDeleted._id });
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
const createPlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let plan = new plans_1.default({
            name: req.body.name,
            completed: false,
            userId: req.params.id,
        });
        let planCreated = yield plan.save();
        let user = (yield user_1.default.findOne({ _id: req.params.id }));
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        user.plans.push(planCreated);
        yield user.save();
        res.status(201).json({ plan: planCreated });
    }
    catch (error) {
        next(error);
    }
});
const deletePlane = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        const deletedPlan = (yield plans_1.default.findByIdAndDelete({
            _id: req.params.id,
        }));
        let user = yield user_1.default.findOne({ _id: deletedPlan.userId });
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        let userPlans = user.plans.filter((v) => v._id && v._id.toString() != deletedPlan._id.toString());
        user.plans = userPlans;
        user.save();
        res.status(204).send({ success: "ok" });
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
exports.userController = {
    getUsers,
    getUserHealth,
    createUser,
    updateUser,
    updateUserCosts,
    deleteUser,
    createPlan,
    deletePlane,
    pokeUser,
    getUserNotificationToken,
};
