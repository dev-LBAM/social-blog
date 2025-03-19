import { NextRequest, NextResponse } from "next/server"
import { parseAuth } from "./auths"


export async function checkRequest(req: NextRequest)
{
    const userId = await parseAuth(req)
    if(userId.status === 401) return userId

    let body
    try 
    {
        body = await req.json()
    }
    catch 
    {
        return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 })
    }

    if (!body || Object.keys(body).length === 0)
    {
        return NextResponse.json(
        { error: 'Content cannot be empty!'},
        { status: 422 })
    }

    return { userId, body }
}



export function checkFileType(url: string)
{
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) 
    {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        return '📷'

        case 'mp4':
        case 'mkv':
        case 'avi':
        return '🎥'

        case 'mp3':
        case 'wav':
        case 'ogg':
        return '🎵'

        case 'pdf':
        case 'doc':
        case 'docx':
        case 'txt':
        return '📄'

        default:
        return '📎'
    }
}


  



