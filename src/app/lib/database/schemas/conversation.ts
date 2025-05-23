import mongoose, { Schema, Document} from 'mongoose'

const ParticipantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const ConversationSchema = new Schema({
  participants: [ParticipantSchema],
  lastMessage: {
    type: String,
    required: true
  },
  lastMessageAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

export interface IParticipant {
  userId: mongoose.Types.ObjectId
  active: boolean
}

export interface IConversation extends Document {
  participants: IParticipant[]
  lastMessage: string
  lastMessageAt: Date
  createdAt?: Date
  updatedAt?: Date
}

ConversationSchema.index({ 'participants.userId': 1, createdAt: -1 })

const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)

export default Conversation
