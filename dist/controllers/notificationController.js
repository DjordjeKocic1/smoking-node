"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notification_1 = __importDefault(require("../model/notification"));
const user_1 = __importDefault(require("../model/user"));
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const getNotificationsByUserID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let notifications = yield notification_1.default.find({
            userId: req.params.id,
        });
        res.status(201).json({ notification: notifications });
    }
    catch (error) {
        next(error);
    }
});
const createNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findOne({ email: req.body.email }));
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        const notification = new notification_1.default({
            isMentoring: req.body.isMentoring,
            isTask: req.body.isTask,
            isRead: false,
            userId: user === null || user === void 0 ? void 0 : user._id,
        });
        let notificationCreated = yield notification.save();
        res.status(201).json({ notification: notificationCreated });
    }
    catch (error) {
        next(error);
    }
});
const updateNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        const { isTask, isMentoring } = req.body;
        let notificationUpdate = yield notification_1.default.find({
            userId: req.params.userId,
        });
        for (const not of notificationUpdate) {
            if (not.isTask && isTask) {
                not.isRead = isTask;
            }
            else if (not.isMentoring && isMentoring) {
                not.isRead = isMentoring;
            }
            else {
                not.isRead = false;
            }
            yield not.save();
        }
        res.status(201).json({ notification: notificationUpdate });
    }
    catch (error) {
        next(error);
    }
});
const deleteNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let isTask = req.query.isTask == "true";
        let isMentoring = req.query.isMentoring == "true";
        yield notification_1.default.deleteMany({
            userId: req.params.userId,
            isTask,
            isMentoring,
        });
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
const deleteAllNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        yield notification_1.default.deleteMany({ userId: req.params.id });
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.notificationController = {
    createNotification,
    updateNotification,
    getNotificationsByUserID,
    deleteNotification,
    deleteAllNotification,
};
