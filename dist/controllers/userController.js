"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const getUsers = (req, res) => {
    user_1.default.find()
        .then((users) => {
        res.status(200).json({ users });
    })
        .catch((error) => {
        console.log("users Get Error:", error);
        res.status(502).json({ error });
    });
};
const getUserHealth = (req, res, next) => {
    user_1.default.findById(req.params.id)
        .then((user) => {
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 422;
            throw error;
        }
        return user.calculateHealth(user);
    })
        .then((healthCalc) => {
        if (!!req.body.notificationToken) {
            user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((data) => {
                res.status(201).json({
                    user: Object.assign(Object.assign({}, healthCalc._doc), { notificationToken: data.notificationToken }),
                });
            });
        }
        else {
            res.status(201).json({ user: healthCalc });
        }
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
        const err = new Error(errors.array()[0].msg);
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
    getUsers,
    getUserHealth,
    createUser,
    updateUser,
    updateUserCosts,
};
