import mongoose from "mongoose";
import IMessage from "../types/IMessage";


const MessageSchema = new mongoose.Schema<IMessage>({
    conversation_id : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true, 
        ref : "Conversation"
    }, 
    sender_id : {
        type : String, 
        required : true
    }, 
    message : {
        type : String, 
        required : true
    }, 
    is_read : {
        type : Boolean, 
        required : false, 
        default : false
    }
}, { timestamps : true });


const Message : IMessageModel = mongoose.model<IMessage, IMessageModel>("Message", MessageSchema);
export default Message;

interface IMessageModel extends mongoose.Model<IMessage> {

}