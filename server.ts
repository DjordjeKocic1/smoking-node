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

app.use(
  (
    error: ErrorMsg,
    req: Request<{}>,
    res: Response<{ error: string }>,
    next: NextFunction
  ) => {
    const status: number = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ error: message });
  }
);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
  })
  .catch((err) => {
    console.log("Db error:", err);
    const errorMy = new Error(
      "Something went wrong with a server, please try again later. We are sorry to keep you waiting."
    );
    throw errorMy;
  });
