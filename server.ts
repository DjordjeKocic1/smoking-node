import { ErrorMsg } from "./types/types";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const dotenv = require("dotenv").config();
const port = process.env.PORT || 8000;

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

app.use(express.json());
app.use(multer({ storage: storage }).single("image"));

app.use("/send-user-info", require("./routes/rootRoutes"));

app.use((error:ErrorMsg, req:any, res:any) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
  })
  .catch((err) => console.log("Db error:",err));
