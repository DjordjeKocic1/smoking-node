import { NextFunction, Request, Response } from "express";

import passport from "passport";

const googleSignIn = 
  passport.authenticate("google", { scope: ["profile", "email"] });

const googleSignInCallback = (req:any,res:Response,next:NextFunction) => {
  passport.authenticate('google', function(err:any, user:any, info:any, status:any) {
    if (err) { return next(err) }
    if (!user) { return res.redirect(`/send-user-info/auth/google`) }
    res.redirect(`exp://192.168.0.11:19000/?email=${req.user.email}`);
  })(req, res, next);
};

export const authController = {
    googleSignIn,
    googleSignInCallback
}
