import mongoose from "mongoose";
import IMessage from "./IMessage";
interface IConversation {
    _id? : mongoose.Types.ObjectId;
    members : Array<string>;
    last_message? : IMessage | mongoose.Types.ObjectId;
    createdAt? : Date;
    updatedAt? : Date;
}

export default IConversation;