import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import { calculate_total_pages_for_pagination, send_error_response, send_response } from "../helpers/response";

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
};

export default ConversationController;

function get_user_id_from_req_params(req: Request): string {
    const { user_id } = req.params;
    if (!user_id) throw new Error("user_id is necessary");
    return user_id;
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
