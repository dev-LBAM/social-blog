import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
    authorId: 
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
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
},
{
  timestamps: true,
})

interface IPost extends Document 
{
    authorId: Schema.Types.ObjectId
    content: string
    imageUrl?: string
    likeCount: number,
    commentCount: number,
}

PostSchema.index({authorId: 1, createdAt: -1})

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
