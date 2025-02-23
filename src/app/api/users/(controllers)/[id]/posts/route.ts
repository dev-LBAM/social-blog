import { NextRequest} from 'next/server'
import { getUserPostsService } from '../../../(services)/get-posts.service'

export async function GET(req: NextRequest) /* GET PUBLIC DATA OF USER */
{
    const userId = req.nextUrl.pathname.split('/')[3]

    const response = await getUserPostsService(userId, req) 
    return response
}