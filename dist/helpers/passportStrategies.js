"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = void 0;
require("dotenv").config();
exports.google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
};
