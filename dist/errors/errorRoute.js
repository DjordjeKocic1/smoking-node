"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIDParam = exports.checkUserIDExist = exports.checkMentoringYourSelf = exports.checkAlreadyMentored = exports.checkUserExist = void 0;
const express_validator_1 = require("express-validator");
const mentor_1 = __importDefault(require("../model/mentor"));
const user_1 = __importDefault(require("../model/user"));
const checkUserExist = () => (0, express_validator_1.body)("email").custom((value) => {
    return user_1.default.findOne({ email: value }).then((user) => {
        if (!user) {
            return Promise.reject("User with that email doesn't exist");
        }
    });
});
exports.checkUserExist = checkUserExist;
const checkAlreadyMentored = () => (0, express_validator_1.body)("user").custom((value) => {
    return mentor_1.default.findOne({ mentoringUserId: value._id }).then((user) => {
        if (user) {
            return Promise.reject("Already sent a mentor request");
        }
    });
});
exports.checkAlreadyMentored = checkAlreadyMentored;
const checkMentoringYourSelf = () => (0, express_validator_1.body)("email").custom((value, { req }) => {
    if (req.body.user.email == value) {
        return Promise.reject("Can't mentor your self");
    }
    else {
        return Promise.resolve();
    }
});
exports.checkMentoringYourSelf = checkMentoringYourSelf;
// Tasks error handling
const checkUserIDExist = () => (0, express_validator_1.body)("userId").custom((value) => {
    return user_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject("User of that ID doesnt exists");
        }
    });
});
exports.checkUserIDExist = checkUserIDExist;
//id error
const checkIDParam = (Model) => (0, express_validator_1.param)("id").custom((value) => {
    if (value.length != 24) {
        return Promise.reject(`ID [${value}] length is not 24 chars`);
    }
    return Model.findOne({ _id: value }).then((modalData) => {
        if (!modalData) {
            return Promise.reject(`${Model.modelName} ID [${value}] doesn't exist, please try again later, it could be something wrong with a server. Thank you for your patient`);
        }
    });
});
exports.checkIDParam = checkIDParam;
