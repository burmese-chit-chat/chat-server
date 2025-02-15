import express from "express";
import ConversationController from "../controllers/ConversationController";

const conversation_routes = express.Router();

conversation_routes.delete('/user/:user_id', ConversationController.destroy_with_user_id);
conversation_routes.delete('/conversation/:conversation_id', ConversationController.destroy_with_conversation_id);
conversation_routes.get("/:user_id", ConversationController.get_with_user_id);

export default conversation_routes;