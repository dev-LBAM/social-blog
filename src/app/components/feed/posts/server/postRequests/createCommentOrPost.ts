interface CreateCommentorPostProps {
  postId?: string
  data: object
}

export default async function createCommentOrPost({ postId, data }: CreateCommentorPostProps) 
{
  const endpoint = postId ? `/api/comments/${postId}` : `/api/posts`

  const res = await fetch(endpoint, 
  {
    method: 'POST',
    headers: 
    {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) 
  {
    const error = await res.json()
    throw new Error(error.message)
  }

  const response = await res.json()
  return response
}
