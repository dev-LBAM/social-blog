import mongoose, { Schema } from 'mongoose'
  
const MessageSchema = new Schema({
    conversationId:
    { 
        type: Schema.Types.ObjectId,
        ref:'Conversation',
        required: true
    },
    senderId: 
    { 
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    receiverId: 
    { 
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    text:
    {
        type: String,
        required: false
    },
    file: 
    {
        url: 
        {
            type: String,
            required: false
        },
        type: 
        {
            type: String,
            required: false
        }
    },
    edited:
    {
        type: Boolean,
        required: false,
        default: false
    },
    viewed:
    {
        type: Boolean,
        required: false,
        default: false
    },
    viewedAt:
    {
        type: Date,
        required: false
    }
},
{
    timestamps: true,
})
  
interface IMessage extends Document {
    conversationId: string,
    senderId: string,
    receiverId: string,
    text?: string,
    file?: 
    {
        url: string,
        type: string
    },
    viewed?: boolean,
    viewedAt?: Date
}
  
MessageSchema.index({participants: 1, createdAt: -1})
  
const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
  
export default Message
  