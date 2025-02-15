import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { UpdateUserDTO } from '../(dtos)/update-user.dto'

export async function updateUserService(userId: string, validatedData: UpdateUserDTO)
{
    await connectToDB()
    const updatedData = await User.findByIdAndUpdate(
        userId,
        { $set: validatedData },
        { new: true, returnDocument: 'after' }
    )

    return updatedData
}
