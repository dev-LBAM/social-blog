import User from '@/app/lib/database/schemas/user'
import { RegisterUserDTO } from '../(dtos)/register-user.dto'
import { connectToDB } from '@/app/lib/database/mongodb'

export async function registerUserService(validatedData: RegisterUserDTO)
{
    const newUser = new User({
        ...validatedData
    })

    await connectToDB()
    const registeredData = await newUser.save()

    return registeredData
}
