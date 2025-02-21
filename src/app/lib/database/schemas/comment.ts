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
    content:
    {
        type: String,
        minlength: 1,
        maxlength: 500,
    }
},
{
    timestamps: true,
})
  
interface IComment extends Document 
{
    postId: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    content: string
}
  
CommentSchema.index({userId: 1, createdAt: -1})
  
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
  
export default Comment