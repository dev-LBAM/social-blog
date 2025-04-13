import { cookies } from "next/headers"

export default async function fetchUserId() {
  const cookieStore = await cookies() /* Obtained cookies of server */
  const allCookies = cookieStore.getAll() /* Get all cookies */ 

  const formattedCookies = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";") /*  Format cookies to send in header */
  
  const res = await fetch(`http://localhost:3000/api/auth/verify-userId`, {
    method: "GET",
    headers: {
      Cookie: formattedCookies,
    },
    cache: "no-store", /* Avoids caching */
  })

  if (!res.ok) throw new Error("Error to get userId")

  const userId = await res.json()
  return userId
}
