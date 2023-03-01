"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const task_1 = __importDefault(require("../model/task"));
const express_validator_1 = require("express-validator");
const createTask = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    const task = new task_1.default({
        toDo: req.body.toDo,
        done: req.body.done,
        userId: req.body.userId,
        mentorId: req.body.mentorId,
    });
    task
        .save()
        .then((task) => {
        console.log("Create task:", task);
        res.status(201).json({ task });
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
};
