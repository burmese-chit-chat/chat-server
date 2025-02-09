import mongoose from "mongoose";
interface IMessage {
    _id?: mongoose.Types.ObjectId;
    conversation_id : mongoose.Types.ObjectId;
    sender_id : string;
    message : string;
    is_read? : boolean;
    createdAt : Date;
    updatedAt : Date;
}


export default IMessage;