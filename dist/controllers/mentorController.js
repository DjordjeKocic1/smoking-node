"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorController = void 0;
const mentor_1 = __importDefault(require("../model/mentor"));
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const getMentor = (req, res, next) => {
    mentor_1.default.find()
        .then((mentors) => {
        let arr = mentors.filter((mentor) => mentor.mentoringUser[0]._id == req.params.id || mentor.mentorId == req.params.id);
        res.status(201).json({ mentor: arr[0] });
    })
        .catch((err) => {
        console.log("Find Mentor Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const createMentor = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    user_1.default.findOne({ email: req.body.user.email })
        .then((user) => {
        user_1.default.findOne({ email: req.body.email }).then((userMentor) => {
            const mentor = new mentor_1.default({
                name: req.body.name.trim(),
                email: req.body.email,
                accepted: false,
                mentorId: userMentor === null || userMentor === void 0 ? void 0 : userMentor._id,
                mentoringUser: user,
            });
            mentor
                .save()
                .then((mentor) => {
                console.log("Create Mentor:", mentor);
                res.status(201).json({ mentor });
            })
                .catch((err) => {
                console.log("Create Mentor Error:", err);
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        });
    })
        .catch((err) => {
        console.log("Create Mentor Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const updateMentor = (req, res, next) => {
    mentor_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((mentor) => {
        console.log({ "Mentor Updated": mentor });
        res.status(201).json({ mentor });
    })
        .catch((err) => {
        console.log("Update Mentor Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.mentorController = {
    createMentor,
    updateMentor,
    getMentor,
};
