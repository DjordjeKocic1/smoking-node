"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorController = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const mentor_1 = __importDefault(require("../model/mentor"));
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const express_validator_1 = require("express-validator");
const getMentor = (req, res, next) => {
    mentor_1.default.find()
        .then((mentors) => {
        let arr = mentors.filter((mentor) => mentor.mentoringUser[0]._id == req.params.id ||
            mentor.mentorId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ mentor: null });
        }
        user_1.default.findOne({ email: arr[0].mentoringUser[0].email }).then((user) => {
            let mentorTrans = arr.map((mentor) => {
                return Object.assign(Object.assign({}, mentor), { mentoringUser: user });
            });
            res.status(200).json({
                mentor: Object.assign(Object.assign({}, mentorTrans[0]._doc), { mentoringUser: [mentorTrans[0].mentoringUser] }),
            });
        });
    })
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const createMentor = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http422Error(errors.array()[0].msg);
    }
    user_1.default.findOne({ email: req.body.user.email })
        .then((user) => {
        user_1.default.findOne({ email: req.body.email }).then((userMentor) => {
            const mentor = new mentor_1.default({
                name: req.body.name.trim(),
                email: req.body.email,
                accepted: false,
                mentorId: userMentor === null || userMentor === void 0 ? void 0 : userMentor._id,
                mentoringUserId: user === null || user === void 0 ? void 0 : user._id,
                mentoringUser: user,
            });
            mentor
                .save()
                .then((mentor) => {
                if (!userMentor.notificationToken) {
                    return res.status(201).json({ mentor });
                }
                notifications_1.expoNotification
                    .sendPushNotification({
                    to: userMentor.notificationToken,
                    title: "Mentor",
                    body: "New mentor request 🔧",
                })
                    .then(() => {
                    const notification = new notification_1.default({
                        isTask: false,
                        isMentoring: true,
                        isRead: false,
                        userId: mentor.mentorId,
                    });
                    notification.save().then(() => {
                        res.status(201).json({ mentor });
                    });
                })
                    .catch(() => {
                    next(new errorHandler_1.http500Error());
                });
            })
                .catch(() => {
                next(new errorHandler_1.http500Error());
            });
        });
    })
        .catch(() => {
        next(new errorHandler_1.http500Error());
    });
};
const updateMentor = (req, res, next) => {
    mentor_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((mentor) => {
        user_1.default.findOne({ _id: mentor.mentoringUserId }).then((user) => {
            if (!(user === null || user === void 0 ? void 0 : user.notificationToken)) {
                return res.status(201).json({ mentor });
            }
            notifications_1.expoNotification
                .sendPushNotification({
                to: user.notificationToken,
                title: "Mentor",
                body: `Mentor (${mentor.email}) accepted your request ✅`,
            })
                .then(() => {
                res.status(201).json({ mentor });
            })
                .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        });
    })
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const deleteMentor = (req, res, next) => {
    mentor_1.default.findOneAndDelete({ _id: req.params.id })
        .then((mentor) => {
        return mentor;
    })
        .then((mentor) => {
        return task_1.default.deleteMany({ mentorId: mentor.mentorId });
    })
        .then((result) => {
        res.status(200).json({ success: "ok" });
    })
        .catch((err) => {
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
    deleteMentor,
};
