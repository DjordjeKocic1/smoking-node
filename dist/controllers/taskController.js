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
exports.taskController = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const express_validator_1 = require("express-validator");
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let tasks = yield task_1.default.find();
        let arr = tasks.filter((task) => task.userId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ task: null });
        }
        res.status(200).json({ task: arr });
    }
    catch (error) {
        next(error);
    }
});
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        let taskCreate = yield task.save();
        const notification = new notification_1.default({
            isTask: true,
            isMentoring: false,
            isRead: false,
            userId: taskCreate.userId,
        });
        let notificaitonCreate = yield notification.save();
        let userFind = (yield user_1.default.findOne({
            _id: notificaitonCreate.userId,
        }));
        if (!userFind.notificationToken) {
            return res.status(201).json({ task: taskCreate });
        }
        yield notifications_1.expoNotification.sendPushNotification({
            to: userFind.notificationToken,
            title: "Task",
            body: "You have a new task 📝",
        });
        res.status(201).json({ task: taskCreate });
    }
    catch (error) {
        next(error);
    }
});
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let taskUpdate = (yield task_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }));
        if (req.body.status == "done") {
            let user = (yield user_1.default.findOne({ _id: taskUpdate.userId }));
            user.tasks.push({ taskId: taskUpdate._id, name: taskUpdate.toDo });
            yield user.save();
        }
        res.status(201).json({ task: taskUpdate });
    }
    catch (err) {
        next(err);
    }
});
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        yield task_1.default.deleteOne({ _id: req.params.id });
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.taskController = {
    createTask,
    updateTask,
    getTasks,
    deleteTask,
};
