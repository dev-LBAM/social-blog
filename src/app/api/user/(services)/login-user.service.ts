import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { LoginUserDTO } from '../(dtos)/login-user.dto'
import { comparePassword } from '@/app/lib/middlewares/hash'
import { createToken } from '@/app/lib/middlewares/auth'

export async function loginUserService(validatedData: LoginUserDTO)
{
    await connectToDB()
    const validatedUser = await User.findOne(
        { email: validatedData.email }
    )

    if(validatedUser)
    {
        const validatedPass = await comparePassword(validatedData.password, validatedUser.password)
        if(validatedPass)
        {
            await createToken(validatedUser._id)
            return validatedUser
        }
    }
}
