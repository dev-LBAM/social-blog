interface EditCommentorPostProps 
{
  postId?: string
  commentId?: string
  data: object
}

export default async function editCommentOrPost({ postId, commentId, data }: EditCommentorPostProps) 
{
    const endpoint = postId ? `/api/posts/${postId}` : `/api/comments/${commentId}`

    console.log(endpoint)
    const res = await fetch(endpoint, 
    {
      method: 'PATCH',
      headers: 
      {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if(res.status === 401) 
    {
      window.location.href = '/'
    }
      
    if(!res.ok) 
    {
      const error = await res.json()
      throw new Error(error.message)
    }

    const response = await res.json()
    return response
}
