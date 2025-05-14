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
        maxlength: 10000,
    },
    file: 
    {
        name: 
        {
            type: String,
            required: false,
            default: undefined
        },
        url: 
        {
            type: String,
            required: false,
            default: undefined
        },
        type: 
        {
            type: String,
            required: false,
            default: undefined
        },
        isSensitive:
        {
          type: Boolean,
          required: false,
          default: undefined
        },
        sensitiveLabel:
        {
          type: Array,
          required: false,
          default: undefined
        }
    },
    editAt:
    {
        type: Date,
        required: false,
    },
    categories: {
        type: [String],
        enum: [
          "education",
          "news",
          "technology",
          "art-design",
          "humor",
          "lifestyle-wellness",
          "personal-stories",
          "music",
          "movies-tv",
          "gaming",
          "food-recipes",
          "sports",
          "health-fitness",
          "finance-investment",
          "science",
          "travel",
          "environment-nature",
          "politics-society",
          "books-literature",
          "tech-news",
          "career-jobs",
          "diy-crafts",
          "events-festivals",
          "animals-pets"
        ],
        default: undefined,
      },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
},
{
  timestamps: true,
})

export interface IPost extends Document 
{
    userId: Schema.Types.ObjectId
    text: string
    file:{
        name:string
        url: string
        type:string
        isSensitive: boolean
        sensitiveLabel: string[]
    }
    editAt: Date
    categories: {
        type: [string],
        enum: [
          "education",
          "news",
          "technology",
          "art-design",
          "humor",
          "lifestyle-wellness",
          "personal-stories",
          "music",
          "movies-tv",
          "gaming",
          "food-recipes",
          "sports",
          "health-fitness",
          "finance-investment",
          "science",
          "travel",
          "environment-nature",
          "politics-society",
          "books-literature",
          "tech-news",
          "career-jobs",
          "diy-crafts",
          "events-festivals",
          "animals-pets"
        ],
        default: [],
      },
    likesCount: number
    commentsCount: number
}

PostSchema.index({userId: 1, createdAt: -1})

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
