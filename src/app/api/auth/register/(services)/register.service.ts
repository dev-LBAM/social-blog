import User from '@/app/lib/database/schemas/user'
import { RegisterUserDTO } from '../(dtos)/register.dto'
import { connectToDB } from '@/app/lib/database/mongodb'

export async function registerUserService(validatedData: RegisterUserDTO)
{
    await connectToDB()
    
    const newUser = new User({
        ...validatedData
    })

    const registeredData = await newUser.save()

    return registeredData
}
