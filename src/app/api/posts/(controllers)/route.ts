import { NextRequest} from "next/server"

import { createPostService } from "../(services)/create.service"
export async function POST( req: NextRequest )  /* CREATE POSTS */
{
    const response = await createPostService(req)
    return response
}

import { getPostService } from "../(services)/get.service"
export async function GET(req: NextRequest) /* GET POSTS */
{
    const response = await getPostService(req)
    return response
}
