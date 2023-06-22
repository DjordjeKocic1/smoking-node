import { NextFunction, Request, Response } from "express";

require("dotenv").config();

const keyGetStripe = (req: Request, res: Response, next: NextFunction) => {
  return res.send(process.env.STRIPE_KEY);
};

export const paymentController = {
  keyGetStripe,
};
