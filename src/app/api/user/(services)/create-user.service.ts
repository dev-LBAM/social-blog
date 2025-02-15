import User from '@/app/lib/database/schemas/user'
import { CreateUserDTO } from '../(dtos)/create-user.dto'
import { connectToDB } from '@/app/lib/database/mongodb'

export async function createUserService(validatedData: CreateUserDTO)
{
    const newUser = new User({
        ...validatedData
    })

    await connectToDB()
    const createdData = await newUser.save()

    return createdData
}
