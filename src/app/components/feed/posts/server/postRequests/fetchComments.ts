interface  fetchCommentsProps 
{
    pageParam: string | null
    postId: string
    userId: string
    signal: AbortSignal
}
export default async function fetchComments({pageParam, postId, userId, signal} : fetchCommentsProps ) 
{
    const res = await fetch(`/api/comments/${postId}?cursor=${pageParam || ""}&userId=${userId}`, {signal})
    if (!res.ok) return { comments: [], nextCursor: undefined }

    const comments = await res.json()
    return comments
}

  