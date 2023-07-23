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
const user_1 = __importDefault(require("../model/user"));
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
const getUserHealth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findById(req.params.id));
        let healthCalc = yield user.calculateHealth(user);
        if (!!req.body.notificationToken) {
            let userUpdate = (yield user_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            }));
            return res.status(201).json({
                user: Object.assign(Object.assign({}, healthCalc.toObject()), { notificationToken: userUpdate.notificationToken }),
            });
        }
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
        const userCost = yield user.calculateCosts(req.body);
        res.status(201).json({ user: userCost });
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
};
