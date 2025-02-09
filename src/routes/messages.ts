import express, { Request, Response } from "express";
import MessageController from "../controllers/MessageController";

const message_routes = express.Router();
message_routes.get("/:user1_id/:user2_id", MessageController.get_messages_of_two_users);

export default message_routes;