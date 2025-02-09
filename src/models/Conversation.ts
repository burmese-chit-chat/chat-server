import mongoose from "mongoose";
import IConversation from "../types/IConversation";

const ConversationSchema = new mongoose.Schema<IConversation>({
    members : {
        type : [String], 
        required : true, 
    }, 
    last_message : {
        type : String, 
        required : true 
    }, 
    is_seen : {
        type : Boolean, 
        required : false, 
        default : false
    }
}, {
    timestamps : true
});

const Conversation : IConversationModel = mongoose.model<IConversation, IConversationModel>("Conversation", ConversationSchema);
export default Conversation;





interface IConversationModel extends mongoose.Model<IConversation> {

}