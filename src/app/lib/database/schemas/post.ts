import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
    userId: 
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: 
    {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 500,
    },
    file: 
    {
        url: 
        {
            type: String,
            required: false
        },
        type: 
        {
            type: String,
            required: false
        }
    },
    edited:
    {
        type: Boolean,
        required: false,
        default: false
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
    mediaUrl: string
    likesCount: number,
    commentsCount: number,
}

PostSchema.index({userId: 1, createdAt: -1})

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
