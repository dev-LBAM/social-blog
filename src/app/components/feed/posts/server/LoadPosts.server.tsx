import LogoutButton from "@/app/components/ui/LogoutButton"
import Posts from "../Posts"
import fetchInitialPosts from "./postRequests/fetchPosts"
import fetchUserId from "./postRequests/fetchUserId"

export default async function LoadPosts() 
{
    const userId = await fetchUserId()
    const initialData = await fetchInitialPosts(userId)
    return (
    <>
        <Posts initialData={initialData} userId={userId}/>
        <LogoutButton userId={userId} />
    </>
)
}