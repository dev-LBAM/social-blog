import { cookies } from "next/headers"

export default async function fetchUserId() {
  const cookieStore = await cookies() /* Obtained cookies of server */
  const allCookies = cookieStore.getAll() /* Get all cookies */ 

  const formattedCookies = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";") /*  Format cookies to send in header */
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-userId`, {
    method: "GET",
    headers: {
      Cookie: formattedCookies,
    },
    cache: "no-store", /* Avoids caching */
  })

  if(res.status === 401) 
  {
    window.location.href = '/'
  }
      
  if(!res.ok) 
  {
    const error = await res.json()
    window.location.href = '/'
    throw new Error(error.message)
    
  }

  const userId = await res.json()
  return userId
}
