interface  fetchRepliesProps 
{
    pageParam: string | null
    commentId: string
}
export default async function fetchCommentReplies({pageParam, commentId} : fetchRepliesProps ) 
{
    const res = await fetch(`/api/comments/replies/${commentId}?cursor=${pageParam || ""}`)
    if (!res.ok) return { replies: [], nextCursor: undefined }

    const replies = await res.json()
    return replies
}

  