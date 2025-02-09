import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import { send_error_response, send_response } from "../helpers/response";

const ConversationController = {
    get_with_user_id : async function (req : Request, res : Response) {
        try {
            const user_id : string = get_user_id_from_req_params(req);

            const conversations = await find_sorted_and_paginated_conversations_with_user_id(user_id);

            send_response(res, 200, conversations, "found conversations");
        } catch (e) {
            console.log(e);
            send_error_response(res, 404, "cannot find conversations");
        }
    }
}

export default ConversationController;

function get_user_id_from_req_params (req : Request) : string {
    const { user_id } = req.params;
    if(!user_id) throw new Error("user_id is necessary");
    return user_id;
}

async function find_sorted_and_paginated_conversations_with_user_id (user_id : string) {
    try {
        const conversations = await Conversation.find({ members : { $all : [user_id] } }).sort({ updatedAt : -1 });
        return conversations;
    } catch (e) {
        throw e;
    }
}