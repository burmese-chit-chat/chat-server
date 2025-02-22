import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import { calculate_total_pages_for_pagination, send_error_response, send_response } from "../helpers/response";
import mongoose from "mongoose";
import Message from "../models/Message";
import IMessage from "../types/IMessage";

const CONVERSATION_LIMIT: Readonly<number> = 7;

const ConversationController = {
    get_with_user_id: async function (req: Request, res: Response) {
        try {
            const page: number = Number(req.query.page) || 1;
            const user_id: string = get_user_id_from_req_params(req);
            const total_conversations: number = await Conversation.countDocuments({ members: { $all: [user_id] } });
            if (total_conversations < 1) {
                send_response(res, 200, [], "0 conversations found");
                return;
            }

            const conversations = await find_sorted_and_paginated_conversations_with_user_id(user_id, page, CONVERSATION_LIMIT);

            send_response(res, 200, conversations, "found conversations", undefined, { total : calculate_total_pages_for_pagination(total_conversations, CONVERSATION_LIMIT), page : page });
        } catch (e) {
            console.log(e);
            send_error_response(res, 404, "cannot find conversations");
        }
    },

    destroy_with_user_id  : async function (req : Request, res : Response) {
        try {
            const user_id  =  get_user_id_from_req_params(req);
            const conversations = await find_all_conversations_with_user_id(user_id);
            await Promise.all(conversations.map(item => delete_all_messages_with_conversation_id(item._id)));
            await Promise.all(conversations.map(item => item.deleteOne()));
            send_response(res, 200, null, 'successfully deleted messages and conversations');
        } catch (e) {
            console.log(e);
            send_error_response(res, 500, (e as Error).message);
        }
    }, 
    destroy_with_conversation_id : async function (req : Request, res : Response) {
        try {
            const conversation_id = new mongoose.Types.ObjectId(get_conversation_id_from_req_params(req));

            const conversation = await Conversation.findById(conversation_id);
            await delete_all_messages_with_conversation_id(conversation?._id || conversation_id);
            if(conversation) await conversation.deleteOne();
            send_response(res, 200, null, 'conversation deleted');
        } catch(e) {
            console.log((e as Error).stack);
            send_error_response(res, 500, (e as Error).message);
        }

    }, 
    count_unread_conversations_with_user_id : async function (req : Request, res : Response) {
        try {
            const user_id = get_user_id_from_req_params(req);
            const conversations = await Conversation.find({ members : { $all : [ user_id ] } }).populate([{ path : "last_message", model : "Message" }]);
            const unread_conversations_count = conversations.reduce((acc, item) => {
                if(item.last_message  && (item.last_message as IMessage).sender_id !== user_id && !((item.last_message as IMessage).is_read)) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            send_response(res, 200, unread_conversations_count, 'unread conversations count');

        } catch (e) {
            console.log(e);
            send_error_response(res, 500, (e as Error).message);
        }
    }


};

export default ConversationController;

function get_user_id_from_req_params(req: Request): string {
    const { user_id } = req.params;
    if (!user_id) throw new Error("user_id is necessary");
    return user_id;
}

function get_conversation_id_from_req_params(req: Request): string {
    const { conversation_id } = req.params;
    if (!conversation_id) throw new Error("user_id is necessary");
    return conversation_id;
}

async function find_sorted_and_paginated_conversations_with_user_id(user_id: string, page: number, limit: number) {
    try {

        const conversations = await Conversation.find({ members: { $all: [user_id] } })
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate([{ path: "last_message", model: "Message" }])
        ;

        return conversations;
    } catch (e) {
        throw e;
    }
}

async function find_all_conversations_with_user_id(user_id : string) {
    try{
        const conversations = await Conversation.find({ members : { $all : [ user_id ] } });
        return conversations;
    } catch (e) {
        throw e;
    }
}

async function delete_all_messages_with_conversation_id(conversation_id : mongoose.Types.ObjectId) {
    try {
        await Message.deleteMany({ conversation_id });
    } catch (e) {
        throw e;
    }
}