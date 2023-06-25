const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

require("dotenv").config();

import { google } from "../helpers/passportStrategies";
import passport from "passport";
import session from "express-session";

export const initPassport = (app: any) => {
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: "SECRET",
    })
  );
  //init passport
  app.use(passport.initialize());
  app.use(passport.session());
};

passport.use(
  new GoogleStrategy(
    google,
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      done(null, formatGoogle(profile._json));
    }
  )
);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user: any, done) => done(null, user));

const formatGoogle = (profile: any) => {
  return {
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email,
  };
};
