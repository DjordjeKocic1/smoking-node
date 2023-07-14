import { NextFunction, Request, Response } from "express";

import Stripe from "stripe";

const { STRIPE_KEY, STRIPE_SECRET } = process.env;

const keyGetStripe = (req: Request, res: Response, next: NextFunction) => {
  return res.send(STRIPE_KEY);
};

const paymentSheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret_key = STRIPE_SECRET;

  const stripe = new Stripe(secret_key as string, {
    apiVersion: "2022-11-15",
    typescript: true,
  });

  await stripe.customers.create({
    description: !req.body.email ? "New customer" : req.body.email,
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
    payment_method_types: ["card"],
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
