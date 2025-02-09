import mongoose from "mongoose";
import IConversation from "../types/IConversation";

const ConversationSchema = new mongoose.Schema<IConversation>({
    members : {
        type : [String], 
        required : true, 
    }, 
    last_message : {
        type : mongoose.Schema.Types.ObjectId, 
        required : false, 
        ref : "Message" 
    } 
}, {
    timestamps : true
});

const Conversation : IConversationModel = mongoose.model<IConversation, IConversationModel>("Conversation", ConversationSchema);
export default Conversation;





interface IConversationModel extends mongoose.Model<IConversation> {

}