import { NextRequest, NextResponse } from "next/server"


export async function checkRequest(req: NextRequest)
{
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

    return { body }
}


export function checkFileType(url: string) {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
        // Image
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
            return 'image/' + extension;

        // Video
        case 'mp4':
        case 'mkv':
        case 'avi':
            return 'video/' + extension

        // Audio
        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'audio/' + extension

        // Files
        case 'pdf':
        case 'doc':
        case 'docx':
        case 'txt':
        case 'zip':
        case 'rar':
        case 'exe':
        case 'xml':
        case 'json':
            return 'application/' + extension

        default:
            return 'unknown/' + extension
    }
}


  



