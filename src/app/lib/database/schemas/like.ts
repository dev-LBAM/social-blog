import mongoose, { Schema } from 'mongoose'
  
const LikeSchema = new Schema({
    targetId: 
    { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    targetType: 
    { 
        type: String, enum: ["Post", "Comment"],
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
    targetId: Schema.Types.ObjectId
    targetType: "Post" | "Comment"
    userId: Schema.Types.ObjectId
}
  
LikeSchema.index({userId: 1, createdAt: -1})
  
const Like = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema)
  
export default Like
  