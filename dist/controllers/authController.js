"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const passport_1 = __importDefault(require("passport"));
const googleSignIn = passport_1.default.authenticate("google", { scope: ["profile", "email"] });
const googleSignInCallback = (req, res, next) => {
    passport_1.default.authenticate('google', function (err, user, info, status) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect(`/send-user-info/auth/google`);
        }
        res.redirect(`exp://192.168.0.11:19000/?email=${req.user.email}`);
    })(req, res, next);
};
exports.authController = {
    googleSignIn,
    googleSignInCallback
};
