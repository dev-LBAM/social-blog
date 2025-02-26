import mongoose, { Schema } from 'mongoose'
  
const ConversationSchema = new Schema({
    participants:
    [{ 
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true 
    }],
    lastMessage: 
    { 
        type: String, 
        required: true 
    },
    lastMessageAt: 
    { 
        type: Date, 
        required: true 
    },
},
{
    timestamps: true,
})
  
interface IConversation extends Document 
{
    partcipants: Schema.Types.ObjectId,
    lastMessage: string,
    lastMessageAt: Date,
}
  
ConversationSchema.index({participants: 1, createdAt: -1})
  
const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)
  
export default Conversation
  