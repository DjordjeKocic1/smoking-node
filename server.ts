import express, { NextFunction, Request, Response } from "express";

import { ErrorMsg } from "./types/types";
import mongoose from "mongoose";
import router from "./routes/rootRoutes";

const passport = require("passport");

require("dotenv").config();

const port = process.env.PORT || 8000;

const app = express();
const session = require("express-session");

let userProfile: any;

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use(express.json());

app.use("/send-user-info", router);

app.use(passport.initialize());

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      userProfile = profile;
      return done(null, profile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res: any) {
    res.status(200).json({ user: userProfile });
  }
);

passport.serializeUser(function (user: any, cb: any) {
  cb(null, user);
});

passport.deserializeUser(function (obj: any, cb: any) {
  cb(null, obj);
});

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
