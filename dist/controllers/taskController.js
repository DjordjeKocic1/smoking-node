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
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const io = require("../socket");
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let tasks = (yield task_1.default.find());
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
const getTasksByMentor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let tasks = (yield task_1.default.find());
        let arr = tasks.filter((task) => task.userId == req.params.userId && task.mentorId == req.params.mentorId);
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
        let user = (yield user_1.default.findOne({ _id: taskCreate.userId }));
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        user.tasks.push(taskCreate);
        yield user.save();
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
        let tasks = yield task_1.default.find({ userId: user._id });
        let notifications = yield notification_1.default.find({
            userId: taskCreate.userId,
        });
        io.getIO().emit("notification", {
            action: "create",
            notification: notifications,
            task: tasks,
            ID: user._id,
        });
        res.status(201).json({ task: tasks });
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
        let user = (yield user_1.default.findOne({ _id: taskUpdate.userId }));
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        let userTasks = user.tasks.map((v) => {
            if (!!v._id && v._id.toString() === taskUpdate._id.toString()) {
                return Object.assign(Object.assign({}, taskUpdate), { taskId: taskUpdate._id });
            }
            return Object.assign({}, v);
        });
        user.tasks = userTasks;
        yield user.save();
        let tasks = yield task_1.default.find({ userId: user._id });
        io.getIO().emit("notification", {
            action: "create",
            task: tasks,
            ID: user._id,
        });
        res.status(201).json({ task: tasks });
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
        const deletedTask = (yield task_1.default.findByIdAndDelete({
            _id: req.params.id,
        }));
        let user = yield user_1.default.findOne({ _id: deletedTask.userId });
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        let userTasks = user.tasks.filter((v) => v._id && v._id.toString() != deletedTask._id.toString());
        user.tasks = userTasks;
        user.save();
        let tasks = yield task_1.default.find({ userId: user._id });
        io.getIO().emit("notification", {
            action: "create",
            task: tasks,
            ID: user._id,
        });
        res.status(201).json({ task: tasks });
    }
    catch (error) {
        next(error);
    }
});
exports.taskController = {
    createTask,
    updateTask,
    getTasks,
    getTasksByMentor,
    deleteTask,
};
