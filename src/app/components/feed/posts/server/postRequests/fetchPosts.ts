// ✅ Carregar os primeiros posts no servidor (SSR)
export default async function fetchInitialPosts(userId?: string) {
    const res = await fetch(userId ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?userId=${userId}` : `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, 
    {
      method: 'GET',
      cache: "no-store",
    })

    if(!res.ok) 
    {
      const error = await res.json()
      throw new Error(error.message)
    }

    const posts = await res.json()
    return posts
  }

  