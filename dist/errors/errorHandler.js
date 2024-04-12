"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http500Error = exports.http422Error = exports.http404Error = exports.http401Error = exports.baseError = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["CREATED"] = 201] = "CREATED";
    HttpStatusCode[HttpStatusCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatusCode[HttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
const baseError = class BaseError extends Error {
    constructor(name, statusCode, message, type) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.type = type;
        Error.captureStackTrace(this);
    }
};
exports.baseError = baseError;
const http401Error = class HTTP401Error extends exports.baseError {
    constructor(message) {
        super("UNAUTHORIZED", HttpStatusCode.FORBIDDEN, message, "UNAUTHORIZED");
    }
};
exports.http401Error = http401Error;
const http404Error = class HTTP404Error extends exports.baseError {
    constructor(message) {
        super("PAGE NOT FOUND", HttpStatusCode.NOT_FOUND, message, "NOT FOUND");
    }
};
exports.http404Error = http404Error;
const http422Error = class HTTP422Error extends exports.baseError {
    constructor(message) {
        super("BAD REQUEST", HttpStatusCode.UNPROCESSABLE_ENTITY, message, "UNPROCESSABLE ENTITY");
    }
};
exports.http422Error = http422Error;
const http500Error = class HTTP500Error extends exports.baseError {
    constructor() {
        super("SERVER ERROR", HttpStatusCode.INTERNAL_SERVER, "Something went wrong with a server. Please try again later.", "INTERNAL SERVER ERROR");
    }
};
exports.http500Error = http500Error;
