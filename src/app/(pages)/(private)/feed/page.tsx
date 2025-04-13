import CreatePost from "@/app/components/feed/posts/CreatePost"
import LoadPosts from "@/app/components/feed/posts/server/LoadPosts.server"


export default function FeedPage() {
    return (
        <div className="flex justify-center px-4 py-10 min-h-screen bg-page">
            <div className="w-full max-w-[800px]">
                <CreatePost />
                <LoadPosts />
            </div>
        </div>
    )
}


