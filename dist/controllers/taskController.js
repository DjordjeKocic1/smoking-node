"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const express_validator_1 = require("express-validator");
const getTasks = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http500Error(errors.array()[0].msg);
    }
    task_1.default.find()
        .then((tasks) => {
        let arr = tasks.filter((task) => task.userId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ task: null });
        }
        res.status(200).json({ task: arr });
    })
        .catch((err) => {
        next(err);
    });
};
const createTask = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.http422Error(errors.array()[0].msg);
    }
    const task = new task_1.default({
        toDo: req.body.toDo,
        status: "",
        comment: req.body.comment,
        userId: req.body.userId,
        mentorId: req.body.mentorId,
    });
    task
        .save()
        .then((task) => {
        const notification = new notification_1.default({
            isTask: true,
            isMentoring: false,
            isRead: false,
            userId: task.userId,
        });
        notification.save().then((notificaiton) => {
            user_1.default.findOne({ _id: notificaiton.userId }).then((user) => {
                if (!user.notificationToken) {
                    return res.status(201).json({ success: "ok", task });
                }
                notifications_1.expoNotification
                    .sendPushNotification({
                    to: user.notificationToken,
                    title: "Task",
                    body: "You have a new task 📝",
                })
                    .then(() => {
                    res.status(201).json({ success: "ok", task });
                })
                    .catch((err) => {
                    next(err);
                });
            });
        });
    })
        .catch((err) => {
        next(err);
    });
};
const updateTask = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    task_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((task) => {
        if (req.body.status == "done") {
            user_1.default.findOne({ _id: task.userId }).then((user) => {
                user.tasks.push({ taskId: task._id, name: task.toDo });
                user.save();
            });
        }
        res.status(201).json({ success: "ok", task });
    })
        .catch((err) => {
        next(err);
    });
};
const deleteTask = (req, res, next) => {
    task_1.default.deleteOne({ _id: req.params.id })
        .then((task) => {
        res.status(204).json({ success: "ok" });
    })
        .catch((err) => {
        next(err);
    });
};
exports.taskController = {
    createTask,
    updateTask,
    getTasks,
    deleteTask,
};
