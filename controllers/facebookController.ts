import { RequestHandler } from "express";
import axios from "axios";

require("dotenv").config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;

const login: RequestHandler<{}, {}, {}> = async (req, res, next) => {
  const { code } = req.query;
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}&redirect_uri=<https://istop.site/auth/facebook/callback>`
    );

    const { access_token } = data;

    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`
    );

    res.redirect(
      `exp+istop://1doounm.djole232.19000.exp.direct?email=${profile.email}`
    );
  } catch (error: any) {
    console.error("Error:", error.response.data.error);
  }
};

export const facebookController = {
  login,
};
