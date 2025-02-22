
import { NextRequest} from 'next/server'
import { getUserPublicService } from '../../(services)/get-public.service'

export async function GET(req: NextRequest) 
{
    const userId = req.nextUrl.pathname.split('/')[4]

    const response = await getUserPublicService(userId)
    return response
}