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
exports.feedbackController = void 0;
const feedback_1 = __importDefault(require("../model/feedback"));
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const getFeedbacks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let feedbacks = (yield feedback_1.default.find());
        res.status(200).json({ feedbacks });
    }
    catch (error) {
        next(error);
    }
});
const createFeedback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        const feedback = new feedback_1.default({
            email: req.body.email,
            message: req.body.message,
        });
        yield feedback.save();
        res.status(200).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.feedbackController = {
    getFeedbacks,
    createFeedback,
};
