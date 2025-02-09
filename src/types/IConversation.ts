import mongoose from "mongoose";
interface IConversation {
    _id? : mongoose.Types.ObjectId;
    members : Array<string>;
    last_message : string;
    is_seen : boolean;
    createdAt? : Date;
    updatedAt? : Date;
}

export default IConversation;