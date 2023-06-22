import { NextFunction, Request, Response } from "express";

require("dotenv").config();

const stripe = require("stripe")(
  "sk_test_51NLlrYIJ1tBgBbYuOiIt55uc3wviYcAjYtf8uyge2B6dWZQTgnbm1fx9eHzgVm16QJiYbgtwmytLJX6h0XxqifkF00e0qhgjzv"
);

const checkoutSession = (req: Request, res: Response, next: NextFunction) => {
  stripe.checkout.sessions
    .create({
      line_items: [
        {
          price: "price_1NLlxOIJ1tBgBbYuj4JDZDZy",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `exp://192.168.0.11:19000/?success=true`,
      cancel_url: `exp://192.168.0.11:19000/?canceled=true`,
    })
    .then((session: any) => {
      res.redirect(303, session.url);
    });
};

export const paymentController = {
  checkoutSession,
};
