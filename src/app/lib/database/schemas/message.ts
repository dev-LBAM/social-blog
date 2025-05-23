import mongoose, { Schema, Document } from 'mongoose'

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    file: {
      name: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      isSensitive: {
        type: Boolean,
        required: false,
      },
      sensitiveLabel: {
        type: [String],
        required: false,
      },
    },
    status: {
      // Message delivery status
      type: String,
      enum: ['sent', 'delivered', 'viewed'],
      default: 'sent',
    },
    viewedAt: {
      // Timestamp of when the message was viewed
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // includes createdAt and updatedAt
  }
)

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId
    senderId: mongoose.Types.ObjectId
    receiverId: mongoose.Types.ObjectId
    text?: string
    file?: {
        name?: string
        url?: string
        type?: string
        isSensitive?: boolean
        sensitiveLabel?: string[]
    }
    status: 'sent' | 'delivered' | 'viewed'
    viewedAt?: Date
    createdAt?: Date
    updatedAt?: Date
    
}
MessageSchema.index({ conversationId: 1, createdAt: -1 });
const Message =
  mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema)

export default Message
