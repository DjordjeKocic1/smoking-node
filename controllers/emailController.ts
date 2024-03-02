import { IEmail } from "../types/types";
import { RequestHandler } from "express";
import { http422Error } from "../errors/errorHandler";
import { validationResult } from "express-validator";

const { BREVO_API_KEY } = process.env;

var Brevo = require("@getbrevo/brevo");
var defaultClient = Brevo.ApiClient.instance;

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = BREVO_API_KEY;
var apiInstance = new Brevo.TransactionalEmailsApi();

const createEmail: RequestHandler<{}, { success: string }, IEmail> = async (
  req,
  res,
  next
) => {
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
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(201).json({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

const createDeleteRequestEmail: RequestHandler<
  {},
  { success: string },
  IEmail
> = async (req, res, next) => {
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(201).json({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

export const emailController = {
  createEmail,
  createDeleteRequestEmail,
};
