"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const getUserHealth = (req, res, next) => {
    user_1.default.findById(req.params.id)
        .then((user) => {
        if (!user) {
            const error = new Error("User is not there");
            error.statusCode = 422;
            error.message = "User not found!";
            console.log("Error user getUserHealth", error.stack);
            throw error;
        }
        if (!!req.body.notificationToken) {
            return user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        }
        return user;
    })
        .then(userData => {
        res.status(200).json({ user: userData });
    })
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const createUser = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const err = new Error("Validation failed, entered data is not correct!");
        err.statusCode = 422;
        throw err; //thorw error will go to next error handling
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
            return res.status(201).json({ user: existingUser });
        }
        user
            .save()
            .then((user) => {
            console.log({ "User Created": user });
            res.status(201).json({ user });
        })
            .catch((err) => {
            console.log("Create User Error:", err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    });
};
const updateUser = (req, res, next) => {
    user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((user) => {
        console.log({ "User Updated": user });
        res.status(201).json({ user });
    })
        .catch((err) => {
        console.log("Update User Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const updateUserCosts = (req, res, next) => {
    user_1.default.findById(req.params.id)
        .then((user) => {
        return user.calculateCosts(req.body);
    })
        .then((user) => {
        console.log("User Costs Updated", user);
        res.status(201).json({ user });
    })
        .catch((err) => {
        console.log("Update User Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.userController = {
    getUserHealth,
    createUser,
    updateUser,
    updateUserCosts,
};
