"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.UserTypes = void 0;
var UserTypes;
(function (UserTypes) {
    UserTypes["User"] = "user";
    UserTypes["Mentor"] = "mentor";
})(UserTypes = exports.UserTypes || (exports.UserTypes = {}));
var Session;
(function (Session) {
    Session["verificationRequest"] = "verificationRequest";
    Session["deleteRequest"] = "deleteRequest";
    Session["loginRequest"] = "loginRequest";
})(Session = exports.Session || (exports.Session = {}));
