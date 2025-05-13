import mongoose, { Schema } from 'mongoose'
  
const CommentSchema = new Schema({
    postId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true,
    },
    userId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    parentCommentId: 
    {
        type: Schema.Types.ObjectId, 
        ref: 'Comment',
        required: false, 
    },
    text:
    {
        type: String,
        minlength: 1,
        maxlength: 1500,
        required: false,
    },
    file: 
    {
        name: 
        {
            type: String,
            required: false
        },
        url: 
        {
            type: String,
            required: false
        },
        type: 
        {
            type: String,
            required: false
        },
        isSensitive:
        {
          type: Boolean,
          required: false
        },
        sensitiveLabel:
        {
          type: Array,
          required: false
        }
    },
    editAt:
    {
        type: Date,
        required: false,
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
},
{
    timestamps: true,
})
  
interface IComment extends Document 
{
    postId: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    text: string
    editAt: Date
    likesCount: number
    answersCount: number
    file:{
        name: string,
        url: string,
        type: string
        isSensitive: boolean
        sensitiveLabel: string[]
    }
}

CommentSchema.index({userId: 1, createdAt: -1})
  
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
  
export default Comment