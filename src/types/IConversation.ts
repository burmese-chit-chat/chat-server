import mongoose from "mongoose";
interface IConversation {
    _id? : mongoose.Types.ObjectId;
    members : Array<string>;
    last_message : string;
    createdAt? : Date;
    updatedAt? : Date;
}

export default IConversation;