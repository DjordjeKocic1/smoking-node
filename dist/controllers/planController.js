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
exports.planController = void 0;
const plans_1 = __importDefault(require("../model/plans"));
const user_1 = __importDefault(require("../model/user"));
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const createPlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let plan = new plans_1.default({
            name: req.body.name,
            completed: false,
            userType: req.body.userType,
            userId: req.params.id,
        });
        let planCreated = yield plan.save();
        let user = (yield user_1.default.findOne({ _id: req.params.id }));
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        user.plans.push(planCreated);
        yield user.save();
        res.status(201).json({ plan: planCreated });
    }
    catch (error) {
        next(error);
    }
});
const deletePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        const deletedPlan = (yield plans_1.default.findByIdAndDelete({
            _id: req.params.id,
        }));
        let user = yield user_1.default.findOne({ _id: deletedPlan.userId });
        if (!user) {
            throw new errorHandler_1.http422Error("User doesn't exist");
        }
        let userPlans = user.plans.filter((v) => v._id && v._id.toString() != deletedPlan._id.toString());
        user.plans = userPlans;
        user.save();
        res.status(204).send({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.planController = {
    createPlan,
    deletePlan,
};
