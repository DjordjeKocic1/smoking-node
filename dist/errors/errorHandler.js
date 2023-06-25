"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http500Error = exports.http404Error = exports.http422Error = exports.baseError = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["CREATED"] = 201] = "CREATED";
    HttpStatusCode[HttpStatusCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
const baseError = class BaseError extends Error {
    constructor(name, statusCode, description) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
};
exports.baseError = baseError;
const http422Error = class HTTP400Error extends exports.baseError {
    constructor(description) {
        super("BAD REQUEST", HttpStatusCode.UNPROCESSABLE_ENTITY, description);
    }
};
exports.http422Error = http422Error;
const http404Error = class HTTP500Error extends exports.baseError {
    constructor() {
        super("PAGE NOT FOUND", HttpStatusCode.NOT_FOUND, "Page not found.");
    }
};
exports.http404Error = http404Error;
const http500Error = class HTTP500Error extends exports.baseError {
    constructor() {
        super("SERVER ERROR", HttpStatusCode.INTERNAL_SERVER, "We are sorry, something went wrong. Please try again later.");
        Error.captureStackTrace(this);
    }
};
exports.http500Error = http500Error;
