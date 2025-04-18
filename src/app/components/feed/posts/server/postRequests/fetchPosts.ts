// ✅ Carregar os primeiros posts no servidor (SSR)
export default async function fetchInitialPosts(userId?: string) {
    const res = await fetch(userId ? `http://localhost:3000/api/posts?userId=${userId}` : `http://localhost:3000/api/posts`, 
    {
      method: 'GET',
      cache: "no-store",
    })
    
    console.log(userId)

    if(!res.ok) 
    {
      const error = await res.json()
      throw new Error(error.message)
    }

    const posts = await res.json()
    return posts
  }

  