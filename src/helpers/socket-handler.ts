// socketHandler.ts
import { Server, Socket } from "socket.io";

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("a client connected");

        socket.on("send_message", (arg) => {
            console.log(arg);
        });

        // You can add more event listeners here
    });
};