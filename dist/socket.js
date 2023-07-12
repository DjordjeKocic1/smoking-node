"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("./errors/errorHandler");
let io;
module.exports = {
    init: (httpServer) => {
        io = require("socket.io")(httpServer);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new errorHandler_1.http500Error("Socket not initialize");
        }
        return io;
    }
};
