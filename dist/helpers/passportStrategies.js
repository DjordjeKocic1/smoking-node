"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitter = exports.facebook = exports.google = void 0;
exports.google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
};
exports.facebook = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/facebook/callback",
};
exports.twitter = {
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/twitter/callback",
};
