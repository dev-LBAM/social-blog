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
  city: 
  {
    type: String,
    required: true,
  },
  country: 
  {
    type: String,
    required: true,
  },
  profileImg:
  {
    type: String,
    required: false
  },
  followersCount: { type: Number, default: 0 },
  postsCount: { type: Number,  default: 0 }
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
  city: string
  country: string,
  profileImg: string,
  followerCount: number,
  postCount: number
}

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
