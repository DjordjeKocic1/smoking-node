"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModelID = exports.checkMentorIDExist = exports.checkUserIDExist = exports.checkMentoringYourSelf = exports.checkAlreadyMentored = exports.checkUserExist = exports.checkIdParams = void 0;
const express_validator_1 = require("express-validator");
const mentor_1 = __importDefault(require("../model/mentor"));
const user_1 = __importDefault(require("../model/user"));
//common errors
const checkIdParams = () => (0, express_validator_1.param)("id").custom((value) => {
    if (value.length !== 24) {
        return Promise.reject("ID is not valid");
    }
    else {
        return Promise.resolve();
    }
});
exports.checkIdParams = checkIdParams;
const checkUserExist = () => (0, express_validator_1.body)("email").custom((value, { req }) => {
    if (!req.body.email) {
        return Promise.reject("Email is required");
    }
    return user_1.default.findOne({ email: value }).then((user) => {
        if (!user) {
            return Promise.reject("User with that email doesn't exist in our database. Share the app with him on a home screen");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkUserExist = checkUserExist;
const checkAlreadyMentored = () => (0, express_validator_1.body)("user").custom((value) => {
    if (!value) {
        return Promise.reject("User doesn't exist.Please try again later.");
    }
    if (!value.email) {
        return Promise.reject("Email required.Please try again later.");
    }
    return Promise.resolve();
});
exports.checkAlreadyMentored = checkAlreadyMentored;
const checkMentoringYourSelf = () => (0, express_validator_1.body)("email").custom((value, { req }) => {
    if (!req.body.email) {
        return Promise.reject("User doesn't exist.Please try again later.");
    }
    if (req.body.user.email == value) {
        return Promise.reject("Can't mentor your self");
    }
    return Promise.resolve();
});
exports.checkMentoringYourSelf = checkMentoringYourSelf;
// Tasks error handling
const checkUserIDExist = () => (0, express_validator_1.body)("userId").custom((value) => {
    return user_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject("Create Task User ID doesn't exist");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkUserIDExist = checkUserIDExist;
const checkMentorIDExist = () => (0, express_validator_1.body)("mentorId").custom((value) => {
    return mentor_1.default.findOne({ mentorId: value }).then((user) => {
        if (!user) {
            return Promise.reject("Create Task Mentor ID doesn't exist");
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkMentorIDExist = checkMentorIDExist;
//Model ID error
const checkModelID = (Model) => (0, express_validator_1.param)("id").custom((value) => {
    return Model.findOne({ _id: value }).then((modalData) => {
        if (!modalData) {
            return Promise.reject(`${Model.modelName} doesn't exist, please try again, it could be something wrong with a server.`);
        }
        else {
            return Promise.resolve();
        }
    });
});
exports.checkModelID = checkModelID;
