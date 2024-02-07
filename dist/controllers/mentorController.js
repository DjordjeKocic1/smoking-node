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
const mentor_1 = __importDefault(require("../model/mentor"));
const notification_1 = __importDefault(require("../model/notification"));
const user_1 = __importDefault(require("../model/user"));
const notifications_1 = require("../helpers/notifications/notifications");
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const io = require("../socket");
const getMentor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let mentors = (yield mentor_1.default.find());
        let arr = mentors.filter((mentor) => mentor.userId == req.params.id);
        if (arr.length == 0) {
            return res.status(200).json({ mentor: null });
        }
        let ids = arr[0].mentoringUser.map((v) => { var _a; return (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString(); });
        let usersMentoring = yield user_1.default.find().where("_id").in(ids).exec();
        if (usersMentoring) {
            let userMapping = usersMentoring.map((userMentor) => {
                let findUser = arr[0].mentoringUser.find((v) => v._id.toString() === userMentor._id.toString());
                return Object.assign(Object.assign({}, userMentor._doc), { accepted: findUser.accepted });
            });
            arr[0].mentoringUser = userMapping;
        }
        res.status(200).json({
            mentor: arr[0],
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
        if (!user.subscription.subscriber) {
            throw new errorHandler_1.http422Error("User is not subscriber");
        }
        let userMentor = (yield user_1.default.findOne({ email: req.body.email }));
        if (!userMentor) {
            return res.status(201).send("EXISTSFALSE");
        }
        let mentorExist = (yield mentor_1.default.findOne({
            email: req.body.email,
        }));
        const mentor = new mentor_1.default({
            name: req.body.name,
            email: req.body.email,
            userId: userMentor === null || userMentor === void 0 ? void 0 : userMentor._id,
            mentoringUser: {
                name: user.name,
                email: user.email,
                accepted: false,
                _id: user._id,
            },
        });
        let userExistWithinMentor = mentorExist &&
            mentorExist.mentoringUser.find((value) => value.email == user.email);
        if (userExistWithinMentor) {
            throw new errorHandler_1.http422Error(`You are already mentored by that user`);
        }
        let mentorCreate;
        if (mentorExist) {
            mentorExist.mentoringUser.push({
                email: user.email,
                name: user.name,
                _id: user._id,
            });
            mentorCreate = yield mentorExist.save();
        }
        else {
            mentorCreate = yield mentor.save();
        }
        user.mentors.push(mentorCreate);
        yield user.save();
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
            userId: mentor.userId,
        });
        yield notification.save();
        let notifications = yield notification_1.default.find({
            userId: mentorCreate.userId,
        });
        io.getIO().emit("live", {
            action: "create",
            notification: notifications,
            mentors: mentorCreate,
            ID: mentorCreate.userId,
        });
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
        let mentorUpdate = (yield mentor_1.default.findOne({
            _id: req.params.id,
        }));
        let arr = mentorUpdate.mentoringUser.map((v) => {
            var _a;
            if (((_a = v._id) === null || _a === void 0 ? void 0 : _a.toString()) == req.body.user.userId.toString()) {
                return Object.assign(Object.assign({}, v), { accepted: req.body.user.accepted, name: req.body.name });
            }
            return Object.assign({}, v);
        });
        mentorUpdate.mentoringUser = arr;
        yield mentorUpdate.save();
        let user = yield user_1.default.findOne({
            _id: req.body.user.userId,
        });
        if (!!user) {
            let userArr = user.mentors.map((v) => {
                var _a;
                if (((_a = v._id) === null || _a === void 0 ? void 0 : _a.toString()) == mentorUpdate._id.toString()) {
                    return Object.assign(Object.assign({}, v), { accepted: req.body.user.accepted, name: req.body.name });
                }
                return Object.assign({}, v);
            });
            user.mentors = userArr;
            yield user.save();
        }
        if (!(user === null || user === void 0 ? void 0 : user.notificationToken) || !req.body.user.accepted) {
            return res.status(201).json({ mentor: mentorUpdate });
        }
        yield notifications_1.expoNotification.sendPushNotification({
            to: user.notificationToken,
            title: "Mentor",
            body: `Mentor (${mentorUpdate.email}) accepted your request ✅`,
        });
        io.getIO().emit("live", {
            action: "create",
            mentors: mentorUpdate,
            ID: mentorUpdate.userId,
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
        let mentor = (yield mentor_1.default.findOne({
            _id: req.params.mentorId,
        }));
        let user = (yield user_1.default.findOne({
            _id: req.params.userId,
        }));
        if (!user && !mentor) {
            throw new errorHandler_1.http422Error("User or mentor doesn't exist");
        }
        let userMentorRemoved = user.mentors.filter((v) => { var _a; return ((_a = v._id) === null || _a === void 0 ? void 0 : _a.toString()) != mentor._id.toString(); });
        let mentorRemoveUser = mentor.mentoringUser.filter((v) => { var _a; return ((_a = v._id) === null || _a === void 0 ? void 0 : _a.toString()) != user._id.toString(); });
        user.mentors = userMentorRemoved;
        yield user.save();
        mentor.mentoringUser = mentorRemoveUser;
        yield mentor.save();
        res.status(204).json({ success: "ok" });
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
