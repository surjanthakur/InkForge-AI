import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { UsePosts } from "../hooks/usePosts";
import { DownloadIcon, ImageIcon, MoreHorizontal } from "lucide-react";
import { Loader } from "../components/index";
import { toast } from "react-hot-toast";

export default function PostPage() {
  const { post_id } = useParams();
  const { currUser } = useAuthContext();
  const { get_post, loading } = UsePosts();
  const [post, setPost] = useState(null);

  const displayName = currUser?.username || "User";

  const avatarInitials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await get_post(post_id);
      if (!res.ok) {
        toast.error(res.detail);
        return;
      }
      setPost(res.data);
    };

    fetchPost();
  }, [post_id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-20">
        <Loader />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full flex justify-center mt-20 text-red-500">
        Post not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Author Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black">
            <span className="text-white text-xs font-semibold">
              {avatarInitials}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-semibold">{displayName}</p>
            <p className="text-gray-500 text-xs">created: {post.created_at}</p>
          </div>
        </div>

        {currUser && currUser.user_id === post.user_id && (
          <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
            Edit
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between py-3 border-b text-gray-500 text-sm">
        <div className="flex gap-4">
          <button className="hover:text-black flex items-center gap-1">
            <DownloadIcon size={16} />
            Download PDF
          </button>
          <button className="hover:text-black flex items-center gap-1">
            <ImageIcon size={16} />
            Download Image
          </button>
          <button className="hover:text-black">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-serif mt-8 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
