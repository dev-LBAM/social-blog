import { NextRequest} from 'next/server'

import { updatePostService } from '../../(services)/update.service'
export async function PATCH(req: NextRequest) /* UPDATE POST */
{
    const response = await updatePostService(req)
    return response
}

