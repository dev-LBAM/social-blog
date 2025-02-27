import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { LoginUserDTO } from '../(dtos)/login-user.dto'
import { comparePassword } from '@/app/lib/utils/auths'
import { createAuth } from '@/app/lib/utils/auths'

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
            await createAuth(validatedUser._id)
            return validatedUser
        }
    }
}
