import { NextRequest} from "next/server"

import { createPostService } from "../(services)/create.service"
export async function POST( req: NextRequest )  /* CREATE POST */
{
    const response = await createPostService(req)
    return response
}