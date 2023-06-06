"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const express_validator_1 = require("express-validator");
const getTasks = (req, res, next) => {
    task_1.default.find()
        .then((tasks) => {
        let arr = tasks.filter((task) => task.userId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ success: "ok", task: [] });
        }
        res.status(200).json({ task: arr });
    })
        .catch((err) => {
        console.log("Get task Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const createTask = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
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
        console.log("Create task:", task);
        const notification = new notification_1.default({
            isTask: true,
            isMentoring: false,
            isRead: false,
            userId: task.userId,
        });
        notification.save().then((notificaiton) => {
            console.log("Create Notification:", notificaiton);
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
                    console.log("Expo Notification Token:", err);
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            });
            res.status(201).json({ success: "ok", task });
        });
    })
        .catch((err) => {
        console.log("Create task Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const updateTask = (req, res, next) => {
    task_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((task) => {
        console.log({ "task Updated": task });
        res.status(201).json({ success: "ok", task });
    })
        .catch((err) => {
        console.log("Update task Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
const deleteTask = (req, res, next) => {
    task_1.default.deleteOne({ _id: req.params.id })
        .then((task) => {
        console.log({ "task delete": task });
        res.status(204).json({ success: "ok" });
    })
        .catch((err) => {
        console.log("delete task Error:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.taskController = {
    createTask,
    updateTask,
    getTasks,
    deleteTask,
};
