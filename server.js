const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 8000;
const User = require("./model/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/send-user-info", require("./routes/rootRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
  })
  .catch((err) => console.log(err));
