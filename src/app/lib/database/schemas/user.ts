import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: 
  {
    type: String,
    required: true,
    trim: true,
  },
  email: 
  {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: 
  {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 72,
  },
  birthDate: 
  {
    type: Date,
    required: true,
  },
  country: 
  {
    type: String,
    required: true,
  },
  state: 
  {
    type: String,
    required: true,
  },
  city: 
  {
    type: String,
    required: true,
  },
  profileImg:
  {
    type: String,
    required: false
  },
  followersCount: { type: Number, default: 0, required: false },
  postsCount: { type: Number,  default: 0, required: false }
},
{
  timestamps: true,
})

interface IUser extends Document 
{
  name: string
  email: string
  password: string
  birthDate: Date
  country: string
  state: string
  city: string
  profileImg?: string
  followerCount?: number
  postCount?: number
}

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
