interface  fetchRepliesProps 
{
    pageParam: string | null
    commentId: string
    signal: AbortSignal
}
export default async function fetchCommentReplies({pageParam, commentId, signal} : fetchRepliesProps ) 
{
    const res = await fetch(`/api/comments/replies/${commentId}?cursor=${pageParam || ""}`, {signal})
    if (!res.ok) return { replies: [], nextCursor: undefined }

    const replies = await res.json()
    return replies
}

  