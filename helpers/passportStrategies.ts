export const google = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:
    "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
};

export const facebook = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL:
    "https://whale-app-hkbku.ondigitalocean.app/auth/facebook/callback",
};

export const yahoo = {
  consumerKey: process.env.YAHOO_API_KEY,
  consumerSecret: process.env.YAHOO_API_SECRET,
  callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/yahoo/callback",
};
