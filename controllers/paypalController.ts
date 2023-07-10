import { NextFunction, Request, Response } from "express";

import paypal from "paypal-rest-sdk";
import { http500Error } from "../errors/errorHandler";
import User from "../model/user";

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: <string>PAYPAL_CLIENT_ID,
  client_secret: <string>PAYPAL_SECRET,
});

const paypalPay = (req: Request, res: Response, next: NextFunction) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "exp://192.168.0.11:19000",
      cancel_url: "exp://192.168.0.11:19000",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Mentoring",
              sku: "001",
              price: "5",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "5",
        },
        description: "Mentoring system",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment: any) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ link: payment.links[i].href });
        }
      }
    }
  });
};

const paypalSuccess = (req: Request, res: Response, next: NextFunction) => {
  const payerId = req.query.PayerID;
  const paymentId = <string>req.query.paymentId;

  const execute_payment_json: any = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "5.00",
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        throw new http500Error("Something went wrong when processing payment");
      } else {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).catch(
          (err) => {
            throw new http500Error(err);
          }
        );
        res.json({ payment: "success" });
      }
    }
  );
};

const paypalCancel = (req: Request, res: Response, next: NextFunction) => {
  res.json({ payment: "cancel" });
};

export const paypalController = {
  paypalPay,
  paypalSuccess,
  paypalCancel,
};
