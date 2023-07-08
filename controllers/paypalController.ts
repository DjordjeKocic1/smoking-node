import { NextFunction, Request, Response } from "express";

import paypal from "paypal-rest-sdk";

require("dotenv").config();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: <string>process.env.PAYPAL_CLIENT_ID,
  client_secret: <string>process.env.PAYPAL_SECRET,
});

const paypalPay = (req: Request, res: Response, next: NextFunction) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://192.168.56.1:8000/success",
      cancel_url: "http://192.168.56.1:8000/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Mentoring",
              sku: "1",
              price: "5.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "5.00",
        },
        description: "Mentoring request",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment: any) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

export const paypalController = {
  paypalPay,
};
