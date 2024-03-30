import { IEmail, IUser } from "../types/types";

import { RequestHandler } from "express";
import User from "../model/user";
import { http422Error } from "../errors/errorHandler";
import jwt from 'jsonwebtoken';
import requestIP from 'request-ip';
import { validationResult } from "express-validator";

const { BREVO_API_KEY,SESSION_SECRET } = process.env;

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
  { success: string; redirect: string },
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
    
    let user = await User.findOne({ email: req.body.params.email }) as IUser;

    if(user.removeAccountToken){
      jwt.verify(user.removeAccountToken, SESSION_SECRET as string, (err, decoded) => {
        if (!err) {
          throw new http422Error("You already sent a request to delete your account (approximately 7 days needed to delete your account)");
        }
      })
    }
    let token = jwt.sign({ ip: requestIP.getClientIp(req) }, SESSION_SECRET as string, {
      expiresIn: '7d',
    });
    
    user.removeAccountToken = token;

    await user.save();

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res
      .status(201)
      .json({ success: "ok", redirect: "/account/delete/success" });
  } catch (error) {
    next(error);
  }
};

const createEmailVerification: RequestHandler<
  {},
  { success: string },
  IEmail
> = async (req, res, next) => {
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

  let token = jwt.sign({ email: req.body.email }, SESSION_SECRET as string, {
    expiresIn: '1h',
  });

  sendSmtpEmail.params = {
    token,
  };
  sendSmtpEmail.type = "classic";
  sendSmtpEmail.templateId = 7;
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(201).json({ success: "ok" });
  } catch (error) {
    next(error);
  }
};

export const emailController = {
  createEmail,
  createDeleteRequestEmail,
  createEmailVerification,
};
