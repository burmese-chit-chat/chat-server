import express from "express";
import ConversationController from "../controllers/ConversationController";

const conversation_routes = express.Router();

conversation_routes.get("/:user_id", ConversationController.get_with_user_id);

export default conversation_routes;