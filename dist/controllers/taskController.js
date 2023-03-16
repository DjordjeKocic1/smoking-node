"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const express_validator_1 = require("express-validator");
const getTasks = (req, res, next) => {
    task_1.default.find({ done: false })
        .then((tasks) => {
        let arr = tasks.filter((task) => task.mentorId == req.params.id || task.userId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ task: null });
        }
        console.log("Get Error:", arr);
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
        done: false,
        comment: req.body.comment,
        userId: req.body.userId,
        mentorId: req.body.mentorId,
    });
    task
        .save()
        .then((task) => {
        console.log("Create task:", task);
        const notification = new notification_1.default({
            isAchievement: false,
            isTask: true,
            isMentoring: false,
            isRead: false,
            userId: task.userId,
        });
        notification.save().then((notificaiton) => {
            console.log("Create Notification:", notificaiton);
            res.status(201).json({ task });
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
        res.status(201).json({ task });
    })
        .catch((err) => {
        console.log("Update task Error:", err);
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
};
