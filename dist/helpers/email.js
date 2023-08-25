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
exports.sendEmail = void 0;
const errorHandler_1 = require("../errors/errorHandler");
const { BREVO_API_KEY } = process.env;
var Brevo = require("@getbrevo/brevo");
var defaultClient = Brevo.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = BREVO_API_KEY;
var apiInstance = new Brevo.TransactionalEmailsApi();
const sendEmail = (name, email, templateId) => __awaiter(void 0, void 0, void 0, function* () {
    var sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Mentor Request";
    sendSmtpEmail.sender = {
        name: "iStop",
        email: "sale.dalibor.djole@gmail.com",
    };
    sendSmtpEmail.to = [
        {
            name: name,
            email: email,
        },
    ];
    sendSmtpEmail.type = "classic";
    sendSmtpEmail.templateId = templateId;
    try {
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
    }
    catch (error) {
        throw new errorHandler_1.http422Error("Email has not been sent");
    }
});
exports.sendEmail = sendEmail;
