import mongoose, { Schema } from 'mongoose'
  
const CommentSchema = new Schema({
    postId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: "Post", 
        required: true,
    },
    userId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    comment:
    {
        type: String,
        minlength: 1,
        maxlength: 500,
        required: true,
    },
    imageUrl: 
    {
        type: String,
        required: false,
    },
},
{
    timestamps: true,
})
  
interface IComment extends Document 
{
    postId: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    comment: string
    imageUrl?: string
}

CommentSchema.index({userId: 1, createdAt: -1})
  
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
  
export default Comment