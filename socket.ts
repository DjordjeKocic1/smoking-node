import { Server } from "http";
import { Socket } from "socket.io";

let io: Socket;

module.exports = {
  init: (httpServer: Server) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
