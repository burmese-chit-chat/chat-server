import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import { send_error_response, send_response } from "../helpers/response";
import mongoose from "mongoose";
import Message from "../models/Message";



const MESSAGE_LIMIT : Readonly<number> = 10;

const MessageController = {
    get_messages_of_two_users : async function (req : Request, res : Response)  {
        try {
            const { user1_id, user2_id } = req.params;

            if(!user1_id || !user2_id) throw new Error("user identifiers are missing");

            const conversation = await Conversation.findOne({ members : { $all : [ user1_id, user2_id ] }});

            if(!conversation) {
                send_response(res, 200, [], "no conversation found");
                return;
            }
            const messages = await fetch_messages_from_database_based_on_conversation_id_and_before(req, conversation._id);

            send_response(res, 200, messages, "messages found successfully");
        } catch (e) {
            console.log(e);
            send_error_response(res, 500, (e as Error).message);
        }
    }, 
    update_is_read_to_true : async function (req : Request, res : Response) {
        try {
            const { message_id } = req.params;
            const message = await Message.findByIdAndUpdate(message_id, { is_read : true });
            send_response(res, 200, message, "message updated");
        } catch (e) {
            console.log(e);
            send_error_response(res, 500, (e as Error).message);
        }

    }
}
export default MessageController;

async function fetch_messages_from_database_based_on_conversation_id_and_before(req : Request, conversation_id : mongoose.Types.ObjectId) {
    try {
        const before = req.query.before;
        const query : any = { conversation_id }
        if (before) {
            const last_message = await Message.findById(before);
            if(last_message) query.createdAt = { $lt: last_message.createdAt }
        }

        const messages = await Message.find(query).sort({ createdAt : -1 }).limit(MESSAGE_LIMIT).lean();
        return messages.reverse();
    } catch (e) {
        console.log("error in fetch_messages_from_database_based_on_conversation_id_based_on_before", e);
        throw e;
    }

}