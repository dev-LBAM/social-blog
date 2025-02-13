import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
    password: {
        type: String,
        required: true,
        minlength: 8,
      },
    age: {
        type: Number,
        required: true,
      },
    birthDate: {
        type: Date,
        required: true,
      },
    city: {
        type: String,
        required: true,
      },
    country: {
        type: String,
        required: true,
      },
},
    {
        timestamps: true,
    }    
)

interface IUser extends Document 
{
    name: string
    email: string
    password: string
    age: number
    birthDate: Date
    city: string
    country: string
}

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
