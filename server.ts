import express, { NextFunction, Request, Response } from "express";

import { ErrorMsg } from "./types/types";
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
    res.redirect(
      "exp://192.168.0.11:19000/login?user=" + JSON.stringify(req.user)
    );
  }
);

app.use(
  (
    error: ErrorMsg,
    req: Request<{}>,
    res: Response<{ message: string }>,
    next: NextFunction
  ) => {
    const status: number = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
  }
);

mongoose
  .connect(process.env.MONGO_URI_COPY as string)
  .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
  })
  .catch((err) => console.log("Db error:", err));
