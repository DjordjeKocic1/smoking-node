import { NextFunction, Request, Response } from "express";

import Stripe from "stripe";

require("dotenv").config();

const keyGetStripe = (req: Request, res: Response, next: NextFunction) => {
  return res.send(process.env.STRIPE_KEY_LIVE);
};

const paymentSheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret_key = process.env.STRIPE_SECRET_LIVE;

  const stripe = new Stripe(secret_key as string, {
    apiVersion: "2022-11-15",
    typescript: true,
  });

  await stripe.customers.create({
    description: "New Customer",
  });

  const customers = await stripe.customers.list();

  const customer = customers.data[0];

  if (!customer) {
    return res.send({
      error: "You have no customer created",
    });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return res.status(201).json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
};

export const paymentController = {
  keyGetStripe,
  paymentSheet,
};
