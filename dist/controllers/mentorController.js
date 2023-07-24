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
exports.mentorController = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const mentor_1 = __importDefault(require("../model/mentor"));
const notification_1 = __importDefault(require("../model/notification"));
const task_1 = __importDefault(require("../model/task"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const express_validator_1 = require("express-validator");
const getMentor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let mentors = (yield mentor_1.default.find());
        let arr = mentors.filter((mentor) => mentor.mentoringUser[0]._id == req.params.id ||
            mentor.mentorId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ mentor: null });
        }
        let user = (yield user_1.default.find({
            email: arr[0].mentoringUser[0].email,
        }));
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        let mentorTrans = arr.map((mentor) => {
            return Object.assign(Object.assign({}, mentor), { mentoringUser: user });
        });
        res.status(200).json({
            mentor: mentorTrans[0]._doc,
        });
    }
    catch (error) {
        next(error);
    }
});
const createMentor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let user = (yield user_1.default.findOne({ _id: req.body.user._id }));
        let userMentor = (yield user_1.default.findOne({ email: req.body.email }));
        let mentorExist = (yield mentor_1.default.findOne({
            email: req.body.email,
        }));
        const mentor = new mentor_1.default({
            name: req.body.name,
            email: req.body.email,
            accepted: false,
            mentorId: userMentor === null || userMentor === void 0 ? void 0 : userMentor._id,
            mentoringUserId: user === null || user === void 0 ? void 0 : user._id,
            mentoringUser: user,
        });
        let userExistWithinMentor = mentorExist &&
            mentorExist.mentoringUser.find((value) => value.email == user.email);
        if (userExistWithinMentor) {
            throw new errorHandler_1.http422Error(`You are already mentoring ${user.name}`);
        }
        let mentorCreate;
        if (mentorExist) {
            mentorExist.mentoringUser.push({
                email: user.email,
                userId: user._id,
                name: user.name,
            });
            mentorCreate = yield mentorExist.save();
        }
        else {
            mentorCreate = yield mentor.save();
        }
        if (!userMentor.notificationToken) {
            return res.status(201).json({ mentor: mentorCreate });
        }
        yield notifications_1.expoNotification.sendPushNotification({
            to: userMentor.notificationToken,
            title: "Mentor",
            body: "New mentor request 🔧",
        });
        const notification = new notification_1.default({
            isTask: false,
            isMentoring: true,
            isRead: false,
            userId: mentor.mentorId,
        });
        yield notification.save();
        res.status(201).json({ mentor: mentorCreate });
    }
    catch (error) {
        next(error);
    }
});
const updateMentor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let mentorUpdate = (yield mentor_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }));
        let user = (yield user_1.default.findOne({
            _id: mentorUpdate.mentoringUserId,
        }));
        if (!(user === null || user === void 0 ? void 0 : user.notificationToken) || !req.body.accepted) {
            return res.status(201).json({ mentor: mentorUpdate });
        }
        yield notifications_1.expoNotification.sendPushNotification({
            to: user.notificationToken,
            title: "Mentor",
            body: `Mentor (${mentorUpdate.email}) accepted your request ✅`,
        });
        res.status(201).json({ mentor: mentorUpdate });
    }
    catch (error) {
        next(error);
    }
});
const deleteMentor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let mentorDelete = (yield mentor_1.default.findOneAndDelete({
            _id: req.params.id,
        }));
        yield task_1.default.deleteMany({ mentorId: mentorDelete.mentorId });
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.mentorController = {
    createMentor,
    updateMentor,
    getMentor,
    deleteMentor,
};
