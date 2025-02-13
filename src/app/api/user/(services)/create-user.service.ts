import User from '@/app/lib/database/schemas/user'
import { CreateUserDTO } from '../(dto)/create-user.dto'
import { connectToDB } from '@/app/lib/database/mongodb'

export async function createUserService(validatedData: CreateUserDTO)
{
    const newUser = new User({
        ...validatedData
    })

    await connectToDB()
    const savedUser = await newUser.save()

    return savedUser
}
