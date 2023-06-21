"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const getUsers = (req, res, next) => {
    user_1.default.find()
        .then((users) => {
        res.status(200).json({ users });
    })
        .catch((err) => {
        next(err);
    });
};
const getUserHealth = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http422Error(errors.array()[0].msg);
    }
    console.log("Params", req.params);
    console.log("Params", req.body);
    user_1.default.findById(req.params.id)
        .then((user) => {
        return user.calculateHealth(user);
    })
        .then((healthCalc) => {
        if (!!req.body.notificationToken) {
            user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((data) => {
                res.status(201).json({
                    user: Object.assign(Object.assign({}, healthCalc._doc), { notificationToken: data.notificationToken }),
                });
            });
            return;
        }
        res.status(201).json({ user: healthCalc });
    })
        .catch(() => {
        next(new errorHandler_1.http500Error());
    });
};
const createUser = (req, res, next) => {
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
    user_1.default.find().then((users) => {
        let existingUser = users.find((user) => user.email == req.body.email);
        if (!!existingUser) {
            console.log("Existing User", user.email);
            return res.status(201).json({ user: existingUser });
        }
        user
            .save()
            .then((user) => {
            console.log("User Created", user);
            res.status(201).json({ user });
        })
            .catch((err) => {
            next(new errorHandler_1.http500Error());
        });
    });
};
const updateUser = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http422Error(errors.array()[0].msg);
    }
    user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((user) => {
        console.log({ "User Updated": user });
        res.status(201).json({ user });
    })
        .catch(() => {
        next(new errorHandler_1.http500Error());
    });
};
const updateUserCosts = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http422Error(errors.array()[0].msg);
    }
    user_1.default.findById(req.params.id)
        .then((user) => {
        return user.calculateCosts(req.body);
    })
        .then((user) => {
        console.log("User Costs Updated", user);
        res.status(201).json({ user });
    })
        .catch((err) => {
        next(new errorHandler_1.http500Error());
    });
};
exports.userController = {
    getUsers,
    getUserHealth,
    createUser,
    updateUser,
    updateUserCosts,
};
