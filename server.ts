import express, { Request, Response } from "express";

import { ErrorMsg } from "./types/types";
import { http500Error } from "./errors/errorHandler";
import { initPassport } from "./helpers/initPassport";
import mongoose from "mongoose";
import router from "./routes/rootRoutes";

require("dotenv").config();

const port = process.env.PORT || 8000;

const app = express();

initPassport(app);

app.use(express.json());

app.use("/", router);

app.use((error: ErrorMsg, _req: Request, res: Response<{ error: string }>) => {
  console.log("Middleware error", error);
  const status: number = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: message });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    const server = app.listen(port, () => console.log("Server Start"));
    const io = require("./socket").init(server)
    io.on("connection", (socket:any) => {
      console.log(socket);
      
      console.log("Client Connected");
    })
  })
  .catch(() => {
    throw new http500Error("Someting went wrong. Please try again");
  });
