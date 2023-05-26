"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMentoringUserIDExist = exports.checkUserIDExist = exports.checkMentoringYourSelf = exports.checkAlreadyMentored = exports.checkUserExist = void 0;
const mentor_1 = __importDefault(require("../model/mentor"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const checkUserExist = (msg) => (0, express_validator_1.body)("email").custom((value) => {
    return user_1.default.findOne({ email: value }).then((user) => {
        if (!user) {
            return Promise.reject(msg);
        }
    });
});
exports.checkUserExist = checkUserExist;
const checkAlreadyMentored = (msg) => (0, express_validator_1.body)("user").custom((value) => {
    return mentor_1.default.findOne({ mentoringUserId: value._id }).then((user) => {
        if (user) {
            return Promise.reject(msg);
        }
    });
});
exports.checkAlreadyMentored = checkAlreadyMentored;
const checkMentoringYourSelf = (msg) => (0, express_validator_1.body)("email").custom((value, { req }) => {
    if (req.body.user.email == value) {
        return Promise.reject(msg);
    }
    else {
        return Promise.resolve();
    }
});
exports.checkMentoringYourSelf = checkMentoringYourSelf;
// Tasks error handling
const checkUserIDExist = (msg) => (0, express_validator_1.body)("userId").custom((value) => {
    return user_1.default.findOne({ _id: value }).then((user) => {
        if (!user) {
            return Promise.reject(msg);
        }
    });
});
exports.checkUserIDExist = checkUserIDExist;
const checkMentoringUserIDExist = (msg) => (0, express_validator_1.body)("userId").custom((value) => {
    return task_1.default.findOne({ userId: value }).then((task) => {
        mentor_1.default.findOne({ _id: task === null || task === void 0 ? void 0 : task.mentorId }).then((mentor) => {
            if (!mentor) {
                return Promise.reject(msg);
            }
        });
    });
});
exports.checkMentoringUserIDExist = checkMentoringUserIDExist;
// end
