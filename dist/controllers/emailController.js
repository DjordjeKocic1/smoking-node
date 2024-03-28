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
exports.emailController = void 0;
const types_1 = require("../types/types");
const sessions_1 = __importDefault(require("../model/sessions"));
const crypto_1 = __importDefault(require("crypto"));
const errorHandler_1 = require("../errors/errorHandler");
const express_validator_1 = require("express-validator");
const { BREVO_API_KEY } = process.env;
var Brevo = require("@getbrevo/brevo");
var defaultClient = Brevo.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = BREVO_API_KEY;
var apiInstance = new Brevo.TransactionalEmailsApi();
const createEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = !!req.body.subject
        ? req.body.subject
        : "Mentor Request";
    sendSmtpEmail.sender = {
        name: "iStop",
        email: "sale.dalibor.djole@gmail.com",
    };
    sendSmtpEmail.to = [
        {
            name: req.body.name,
            email: req.body.email,
        },
    ];
    sendSmtpEmail.params = req.body.params;
    sendSmtpEmail.type = "classic";
    sendSmtpEmail.templateId = req.body.templateId;
    try {
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(201).json({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
const createDeleteRequestEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Account deletion";
    sendSmtpEmail.sender = {
        name: "iStop",
        email: "sale.dalibor.djole@gmail.com",
    };
    sendSmtpEmail.to = [
        {
            name: "sale.dalibor.djole@gmail.com",
            email: "sale.dalibor.djole@gmail.com",
        },
    ];
    sendSmtpEmail.params = req.body.params;
    sendSmtpEmail.type = "classic";
    sendSmtpEmail.templateId = 6;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorHandler_1.http422Error(errors.array()[0].msg);
        }
        let newSession = new sessions_1.default({
            type: types_1.Session.deleteRequest,
            userId: req.body.params.id.toString(),
            email: req.body.params.email,
            expireAt: new Date().setDate(new Date().getDate() + 30),
        });
        yield newSession.save();
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        res
            .status(201)
            .json({ success: "ok", redirect: "/account/delete/success" });
    }
    catch (error) {
        next(error);
    }
});
const createEmailVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Email Verification";
    sendSmtpEmail.sender = {
        name: "iStop",
        email: "sale.dalibor.djole@gmail.com",
    };
    sendSmtpEmail.to = [
        {
            email: req.body.email,
        },
    ];
    sendSmtpEmail.params = {
        token: crypto_1.default.randomBytes(32).toString("hex"),
    };
    sendSmtpEmail.type = "classic";
    sendSmtpEmail.templateId = 7;
    try {
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        let newSession = new sessions_1.default({
            type: types_1.Session.verificationRequest,
            token: sendSmtpEmail.params.token,
            email: req.body.email,
            expireAt: new Date().setDate(new Date().getDate() + 1),
        });
        yield newSession.save();
        res.status(201).json({ success: "ok" });
    }
    catch (error) {
        next(error);
    }
});
exports.emailController = {
    createEmail,
    createDeleteRequestEmail,
    createEmailVerification,
};
