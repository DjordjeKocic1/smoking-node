import express, { NextFunction, Request, Response } from "express";

import { ErrorMsg } from "./types/types";
import mongoose from "mongoose";
import router from "./routes/rootRoutes";

require("dotenv").config();

const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use("/send-user-info", router);

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
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
  })
  .catch((err) => console.log("Db error:", err));
