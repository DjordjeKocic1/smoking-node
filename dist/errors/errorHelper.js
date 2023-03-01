"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMentoringUserIDExist = exports.checkUserIDExist = exports.checkExistMentor = exports.checkExistMentoring = void 0;
const mentor_1 = __importDefault(require("../model/mentor"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const checkExistMentoring = (msg) => (0, express_validator_1.body)("email").custom((value) => {
    return mentor_1.default.findOne({ email: value }).then((mentor) => {
        if (mentor) {
            return Promise.reject(`${msg} - ${mentor.mentoringUser[0].email}`);
        }
    });
});
exports.checkExistMentoring = checkExistMentoring;
const checkExistMentor = (msg) => (0, express_validator_1.body)("email").custom((value) => {
    return mentor_1.default.findOne({ email: value }).then((mentor) => {
        if (!mentor) {
            return Promise.reject(msg);
        }
    });
});
exports.checkExistMentor = checkExistMentor;
// end
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
