const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 8000;
const User = require("./model/user");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4())
  }
});

app.use(express.json());
app.use(multer({storage:storage}).single("image"))



app.use("/send-user-info", require("./routes/rootRoutes"));

app.use((error, req, res, next) => {
  // console.log("Error Handler", error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
  })
  .catch((err) => console.log(err));
