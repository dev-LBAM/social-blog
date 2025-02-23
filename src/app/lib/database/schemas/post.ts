import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
    userId: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: 
    {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
    },
    imageUrl: 
    {
        type: String,
        required: false,
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
},
{
  timestamps: true,
})

interface IPost extends Document 
{
    userId: Schema.Types.ObjectId
    content: string
    imageUrl?: string
    likesCount: number,
    commentsCount: number,
}

PostSchema.index({userId: 1, createdAt: -1})

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
