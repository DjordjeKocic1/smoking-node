import { Socket } from "socket.io";
import { http500Error } from "./errors/errorHandler";

let io:Socket;

module.exports = {
    init:(httpServer:any) => {
        io = require("socket.io")(httpServer)
        return io;
    },
    getIO:() => {
        if(!io){
            throw new http500Error("Socket not initialize")
        }
        return io;
    }
}