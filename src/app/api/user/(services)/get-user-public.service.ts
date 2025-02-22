
import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'

export async function getUserPublicService(userId: string)
{
    await connectToDB()
    const getedData = await User.findById(userId).select( "-email -password -phone")

    return getedData
}
