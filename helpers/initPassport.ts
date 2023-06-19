const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

import "dotenv/config";

import { google } from "../helpers/passportStrategies";
import passport from "passport";
import session from "express-session";

export const initPassport = (app: any) => {
  //init's the app session
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
      console.log(profile);
      done(null, formatGoogle(profile._json));
    }
  )
);

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user: any, done) => done(null, user));

const formatGoogle = (profile: any) => {
  return {
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.emaiL,
  };
};
