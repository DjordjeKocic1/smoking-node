import { RequestHandler } from "express";

import paypal from "paypal-rest-sdk";
import { http500Error } from "../errors/errorHandler";
import { IQuery } from "../types/types";

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: <string>PAYPAL_CLIENT_ID,
  client_secret: <string>PAYPAL_SECRET,
});

const paypalPay: RequestHandler<{}, {}, { price: string }> = (
  req,
  res,
  next
) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "exp+istop://1doounm.djole232.8081.exp.direct",
      cancel_url: "exp+istop://1doounm.djole232.8081.exp.direct",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Mentoring",
              sku: "001",
              price: req.body.price,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: req.body.price,
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

const paypalSuccess: RequestHandler<{}, {}, {}, IQuery> = (req, res, next) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
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
        throw new http500Error();
      } else {
        res.json({ payment: "success" });
      }
    }
  );
};

const paypalCancel: RequestHandler = (req, res, next) => {
  res.json({ payment: "cancel" });
};

export const paypalController = {
  paypalPay,
  paypalSuccess,
  paypalCancel,
};
