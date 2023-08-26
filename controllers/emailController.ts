import { IEmail } from "../types/types";
import { RequestHandler } from "express";

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
  sendSmtpEmail.subject = "Mentor Request";
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

export const emailController = {
  createEmail,
};
