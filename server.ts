import express, { NextFunction, Request, Response } from "express";

import { ErrorMsg } from "./types/types";
import { http500Error } from "./errors/errorHandler";
import { initPassport } from "./helpers/initPassport";
import mongoose from "mongoose";
import passport from "passport";
import router from "./routes/rootRoutes";

require("dotenv").config();

const port = process.env.PORT || 8000;

const app = express();

initPassport(app);

app.use(express.json());

app.use("/send-user-info", router);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  (req: any, res) => {
    res.redirect(`exp://1doounm.djole232.19000.exp.direct/?email=${req.user.email}`);
  }
);

app.use((error: ErrorMsg, _req: Request, res: Response<{ error: string }>) => {
  console.log("Middleware error", error);
  const status: number = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: message });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(port, () => console.log("Server Start"));
  })
  .catch(() => {
    throw new http500Error("Someting went wrong. Please try again");
  });
