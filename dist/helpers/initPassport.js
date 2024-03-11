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
exports.initPassport = void 0;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
require("dotenv").config();
const passportStrategies_1 = require("../helpers/passportStrategies");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const initPassport = (app) => {
    const secretSession = process.env.SESSION_SECRET;
    app.use((0, express_session_1.default)({
        resave: false,
        saveUninitialized: true,
        secret: secretSession,
    }));
    //init passport
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
};
exports.initPassport = initPassport;
passport_1.default.use(new GoogleStrategy(passportStrategies_1.google, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    done(null, formatGoogle(profile._json));
})));
passport_1.default.use(new FacebookStrategy(passportStrategies_1.facebook, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    done(null, formatGoogle(profile._json));
})));
passport_1.default.use(new TwitterStrategy(passportStrategies_1.twitter, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    done(null, formatGoogle(profile._json));
})));
passport_1.default.serializeUser((user, done) => done(null, user));
passport_1.default.deserializeUser((user, done) => done(null, user));
const formatGoogle = (profile) => {
    return {
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
    };
};
