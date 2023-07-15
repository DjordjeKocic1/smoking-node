import express, { NextFunction, Request, Response } from "express";

import { ErrorMsg } from "./types/types";
import helmet from 'helmet'
import { http500Error } from "./errors/errorHandler";
import { initPassport } from "./helpers/initPassport";
import mongoose from "mongoose";
import morgan from 'morgan'
import router from "./routes/rootRoutes";

require("dotenv").config();

const port = process.env.PORT;

const app = express();

// app.use(helmet())
app.use(morgan('combined'))

initPassport(app);

app.use(express.json());

app.use("/", router);

app.use(
  (
    error: ErrorMsg,
    _req: Request,
    res: Response<{ error: string }>,
    next: NextFunction
  ) => {
    console.log("Middleware error", error);
    const status: number = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ error: message });
  }
);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(port, () => console.log("Server Start"));
  })
  .catch(() => {
    throw new http500Error();
  });
