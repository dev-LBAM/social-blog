// ✅ Carregar os primeiros posts no servidor (SSR)
export default async function fetchInitialPosts(userId?: string) {
    const res = await fetch(userId ? `http://localhost:3000/api/posts` : `http://localhost:3000/api/posts?userId=${userId}`, 
    {
      method: 'GET',
      cache: "no-store",
    })
    
    if(!res.ok) 
    {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  