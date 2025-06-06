import SidebarFollowers from "@/app/components/feed/followers/SidebarFollowers"
import CreatePost from "@/app/components/feed/posts/CreatePost"
import LoadPosts from "@/app/components/feed/posts/server/LoadPosts.server"


export default function FeedPage() {
    return (
        <div className="flex justify-center px-4 py-2 min-h-screen bg-page">

            <div className="w-full max-w-[800px]">
                
                <CreatePost />
                <LoadPosts />
                <SidebarFollowers />
            </div>
        </div>
    )
}


