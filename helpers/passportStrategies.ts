require("dotenv").config();

export const google = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //todo: based on env, change url to localhost, dev or prod
  callbackURL: "http://localhost:8000/auth/google",
};
