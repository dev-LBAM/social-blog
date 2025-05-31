import SidebarFollowers from "@/app/components/feed/followers/SidebarFollowers"
import CreatePost from "@/app/components/feed/posts/CreatePost"
import LoadPosts from "@/app/components/feed/posts/server/LoadPosts.server"
import LogoutButton from "@/app/components/ui/LogoutButton"


export default function FeedPage() {
    return (
        <div className="flex justify-center px-4 py-2 min-h-screen bg-page">
            <LogoutButton />


            <div className="w-full max-w-[800px]">
                
                <CreatePost />
                <LoadPosts />
                <SidebarFollowers />
            </div>
        </div>
    )
}


