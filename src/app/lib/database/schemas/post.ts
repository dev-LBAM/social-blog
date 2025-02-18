import mongoose, { Schema, Types } from 'mongoose'

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

interface IPost extends Document 
{
    userId: Types.ObjectId
    content: string
    imageUrl?: string
}

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
