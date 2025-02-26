import mongoose, { Schema } from 'mongoose'
  
const LikeSchema = new Schema({
    postId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    userId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
},
{
    timestamps: true,
})
  
interface ILike extends Document 
{
    postId: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
}
  
LikeSchema.index({userId: 1, createdAt: -1})
  
const Like = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema)
  
export default Like
  