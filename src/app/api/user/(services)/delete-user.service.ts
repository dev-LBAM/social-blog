import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'

export async function deleteUserService(userId: string)
{
    await connectToDB()
    const deletedData = await User.findByIdAndDelete(userId)

    return deletedData
}
