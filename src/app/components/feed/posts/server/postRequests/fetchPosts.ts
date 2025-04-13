// ✅ Carregar os primeiros posts no servidor (SSR)
export default async function fetchInitialPosts(userId: string) {
    const res = await fetch(`http://localhost:3000/api/posts?userId=${userId}`, {
      cache: "no-store",
    })
    
    if (!res.ok) throw new Error("Error to load posts")
    return res.json()
  }

  