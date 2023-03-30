"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notification_1 = __importDefault(require("../model/notification"));
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const getNotificationsByUserID = (req, res, next) => {
    if (!req.params.id) {
        return res.status(422).json({ error: "user id doesnt exist" });
    }
    notification_1.default.find({ isRead: false })
        .then((notifications) => {
        let nots = notifications.filter((notification) => notification.userId == req.params.id);
        res.status(201).json({ notification: nots });
    })
        .catch((err) => {
        console.log("Create Notificaiton Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const createNotification = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    user_1.default.findOne({ email: req.body.email })
        .then((user) => {
        const notification = new notification_1.default({
            isMentoring: req.body.isMentoring,
            isAchievement: req.body.isAchievement,
            isTask: req.body.isTask,
            isRead: false,
            userId: user === null || user === void 0 ? void 0 : user._id,
        });
        notification
            .save()
            .then((notification) => {
            console.log("Create Notification:", notification);
            res.status(201).json({ notification });
        })
            .catch((err) => {
            console.log("Create Notificaiton Error:", err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    })
        .catch((err) => {
        console.log("Find USER for Notificaiton Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const updateNotification = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    notification_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((notification) => {
        console.log({ "Notification Updated": notification });
        res.status(201).json({ notification });
    })
        .catch((err) => {
        console.log("Update Notification Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const deleteNotification = (req, res, next) => {
    notification_1.default.findOneAndDelete({ _id: req.params.id })
        .then((notification) => {
        console.log({ "notification delete": notification });
        res.status(201).json({ success: "ok" });
    })
        .catch((err) => {
        console.log("delete notification Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.notificationController = {
    createNotification,
    updateNotification,
    getNotificationsByUserID,
    deleteNotification,
};
