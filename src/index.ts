import express from "express";
import http from "http";
import cors from "cors";
import { Request, Response } from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";

require("dotenv").config();

const PORT: Readonly<number> = 8003;
const mongo_url = process.env.MONGO_URL;
if (!mongo_url) {
    throw new Error("MONGO_URL is not defined");
}

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.get("/", (req: Request, res: Response) => {
    console.log("path", req.path);
    res.send("hello world from burmese chit chat CHATTING service");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, // e.g., "http://localhost:3000"
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", socket => {
    console.log("a client connected");
});

mongoose
    .connect(mongo_url, {})
    .then(() => {
        console.log("connected to chatting database");
        server.listen(PORT, () => {
            console.log("burmese chit chat chat server is running on port " + PORT);
        });
    })
    .catch(err => {
        console.error(err);
    });
