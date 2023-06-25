require("dotenv").config();

export const google = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:
    "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
};
