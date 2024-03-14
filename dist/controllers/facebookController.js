"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookController = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    try {
        const { data } = yield axios_1.default.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}&redirect_uri=<https://istop.site/auth/facebook/callback>`);
        const { access_token } = data;
        const { data: profile } = yield axios_1.default.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);
        res.redirect(`exp+istop://1doounm.djole232.19000.exp.direct?email=${profile.email}`);
    }
    catch (error) {
        console.error("Error:", error.response.data.error);
    }
});
exports.facebookController = {
    login,
};
