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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailController = void 0;
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
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        res
            .status(201)
            .json({ success: "ok", redirect: "/account/delete/success" });
    }
    catch (error) {
        next(error);
    }
});
exports.emailController = {
    createEmail,
    createDeleteRequestEmail,
};
