"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewRoutes = void 0;
const path_1 = __importDefault(require("path"));
const viewRoutes = (router) => {
    router.get("/", (req, res, next) => {
        res.redirect("/home");
    });
    router.get("/home", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/", "home.html"));
    });
    router.get("/admin/login", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/admin/", "login.html"));
    });
    router.get("/admin/users", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/admin/", "users.html"));
    });
    router.get("/account/delete/login", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/account/", "login.html"));
    });
    router.get("/account/delete/request", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/account/", "delete.html"));
    });
    router.get("/account/delete/success", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/account/", "success.html"));
    });
    router.get("/account/registration/verification", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/account/", "verification.html"));
    });
    router.get("/account/registration/generate-password?:token", (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname, "../", "views/account/", "password.html"));
    });
};
exports.viewRoutes = viewRoutes;
