"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = void 0;
require("dotenv").config();
exports.google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //todo: based on env, change url to localhost, dev or prod
    callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
};
