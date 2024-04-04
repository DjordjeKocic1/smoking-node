import express, { NextFunction, Request, Response } from "express";

import { ErrorMsg } from "./types/types";
import helmet from "helmet";
import { http500Error } from "./errors/errorHandler";
import { initPassport } from "./helpers/initPassport";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import router from "./routes/apiRoutes";

require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(express.json());

app.use(helmet());
app.use(morgan("combined"));

initPassport(app);

app.use("/", router);

app.use(
  (
    error: ErrorMsg,
    req: Request,
    res: Response<{ error: string; type: string }>,
    next: NextFunction
  ) => {
    console.log("Middleware error", error);
    const status: number = error.statusCode || 500;

    const message = error.message;
    const type = error.type as string;
    res.status(status).json({ error: message, type });
  }
);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    const server = app.listen(port);
    const io = require("./socket").init(server);
    console.log("Server connected", "ENV:", process.env.NODE_ENV);
    io.on("connection", () => {
      console.log("Client Connected");
    });
  })
  .catch(() => {
    throw new http500Error();
  });
