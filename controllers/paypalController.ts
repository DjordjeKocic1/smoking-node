import { RequestHandler } from "express";

import paypal from "paypal-rest-sdk";
import { http500Error } from "../errors/errorHandler";
import { IQuery } from "../types/types";

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  NODE_ENV,
  PAYPAL_LIVE_CLIENT_ID,
  PAYPAL_LIVE_SECRET,
} = process.env;

paypal.configure({
  mode: NODE_ENV === "DEV" ? "sandbox" : "live", //sandbox or live
  client_id:
    NODE_ENV === "DEV"
      ? <string>PAYPAL_CLIENT_ID
      : <string>PAYPAL_LIVE_CLIENT_ID,
  client_secret:
    NODE_ENV === "DEV" ? <string>PAYPAL_SECRET : <string>PAYPAL_LIVE_SECRET,
});

const paypalPay: RequestHandler<{}, {}, {}> = (req, res, next) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "com.istop.quitsmoking://paypalpay",
      cancel_url: "com.istop.quitsmoking://paypalpay",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Mentoring",
              sku: "001",
              price: "1.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "1.00",
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
