// socketHandler.ts
import { Server, Socket } from "socket.io";
import Conversation from "../models/Conversation";
import mongoose from "mongoose";
import Message from "../models/Message";

export const setupSocket = (io: Server) => {
    let global_socket : Socket;

    io.on("connection", (socket: Socket) => {

        socket.on("join_chat", chat_room_id => {
            socket.join(chat_room_id);
            global_socket = socket;
            console.log(`User ${socket.id} joined chat room: ${chat_room_id}`);
        });

        socket.on("send_message", create_message_and_emit_it_to_client);

    });

    async function create_message_and_emit_it_to_client(arg: any) {
        const { message, receiver_id, chat_room_id } = arg;
        try {

            const conversation = await get_new_or_old_conversation(receiver_id, message.sender_id);

            if (!conversation) throw new Error("error creating conversation or old conversation cannot found");

            const new_message = await create_message_and_return_it({ sender_id: message.sender_id, conversation_id: conversation._id, message: message.message });

            conversation.last_message = new_message;
            await conversation.save();
            // emit to client
            io.to(chat_room_id).emit("new_message", new_message);

        } catch (e) {

            io.to(global_socket.id).emit("error_message");

        }
    }
};

async function get_new_or_old_conversation(receiver_id: string, sender_id: string) {
    try {
        const conversation = await Conversation.findOne({ members: { $all: [receiver_id, sender_id] } });
        if (!conversation) {
            const new_conversation = await create_conversation_and_return_it([sender_id, receiver_id]);
            return new_conversation;
        } else {
            await conversation.save();
            return conversation;
        };
    } catch (e) {
        console.log("error in check_if_already_has_a_conversation", e);
        throw e;
    }
}

async function create_conversation_and_return_it(members: Array<string>) {
    try {
        const conversation = new Conversation({ members });
        await conversation.save();
        return conversation;
    } catch (e) {
        console.log("error in create_conversation_and_return_it", e);
        throw e;
    }
}

async function create_message_and_return_it(args: { conversation_id: mongoose.Types.ObjectId; sender_id: string; message: string }) {
    try {
        const message = new Message(args);
        await message.save();
        return message;
    } catch (e) {
        console.log("error in create_message_and_return_it", e);
        throw e;
    }
}
