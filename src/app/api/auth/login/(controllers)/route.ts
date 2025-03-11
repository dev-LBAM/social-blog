import { NextRequest } from "next/server"



import { loginUserService } from "../(services)/login-user.service"
export async function POST(req: NextRequest) /* GET POSTS */
{
    const response = await loginUserService(req)
    return response
}
