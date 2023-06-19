"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const rootRoutes_1 = __importDefault(require("./routes/rootRoutes"));
const passport = require("passport");
require("dotenv").config();
const port = process.env.PORT || 8000;
const app = (0, express_1.default)();
const session = require("express-session");
let userProfile;
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
}));
app.use(express_1.default.json());
app.use("/send-user-info", rootRoutes_1.default);
app.use(passport.initialize());
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://whale-app-hkbku.ondigitalocean.app/auth/google/callback",
}, function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, profile);
}));
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/error" }), function (req, res) {
    res.status(200).json({ user: userProfile });
});
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("connect");
    app.listen(port, () => console.log("Server Start"));
})
    .catch((err) => console.log("Db error:", err));
