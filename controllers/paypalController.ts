import * as paypal from "../helpers/paypal-api";

import { NextFunction, Request, Response } from "express";

require("dotenv").config();

const paypalPay = (req: Request, res: Response, next: NextFunction) => {
  paypal
    .createOrder()
    .then((order: any) => {
      for (let i = 0; i < order.links.length; i++) {
        if (order.links[i].rel === "approve") {
          res.json({ link: order.links[i].href });
        }
      }
    })
    .catch((err) => console.log(err));
};

export const paypalController = {
  paypalPay,
};
