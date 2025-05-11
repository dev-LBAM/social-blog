import { verifyAuth } from "@/app/lib/utils/auths"
import { NextRequest} from "next/server"
import { getFollowerService } from "../(services)/get.service"


export async function GET(req: NextRequest) 
{
    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }

    const { userId } = await auth.json()

    if(userId)
    {
        const response = await getFollowerService(userId)
        auth.headers.forEach((value, key) => 
        {
            if (key.toLowerCase() === 'set-cookie') 
            {
                response.headers.set(key, value)
            }
        })
        return response
    }
}

