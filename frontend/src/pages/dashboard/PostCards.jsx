import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostImage from "../../assets/soft-cartoon.jpeg";

export function PostCard({ post, onDelete }) {
  const navigate = useNavigate();

  const typeBadgeColors = {
    blog: "bg-violet-100 text-violet-600",
    article: "bg-amber-100 text-amber-600",
  };

  const handleCardClick = () => {
    navigate(`/post/${post.post_id}`);
  };

  return (
    <div
      className="flex gap-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={PostImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-gray-900 truncate">{post.title}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${typeBadgeColors[post.post_type]}`}
              >
                {post.post_type}
              </span>
            </div>
            {/* time format */}
            <p className="text-xs text-gray-400 mt-0.5">
              {(() => {
                if (!post.created_at) return "";
                const d = new Date(post.created_at);
                if (isNaN(d.getTime())) return post.created_at;
                return d.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
              })()}
            </p>
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {(() => {
                if (
                  typeof post.content === "object" &&
                  post.content.type === "doc" &&
                  Array.isArray(post.content.content)
                ) {
                  const para = post.content.content.find(
                    (c) => c.type === "paragraph" && Array.isArray(c.content)
                  );
                  if (para) {
                    const textSnippets = para.content
                      .filter((d) => typeof d.text === "string")
                      .map((d) => d.text);
                    return textSnippets
                      .join(" ")
                      .split("\n")
                      .slice(0, 2)
                      .join(" ");
                  }
                }
                return "";
              })()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-500 flex items-center justify-center text-gray-400 transition-colors"
              type="button"
              aria-label="Edit"
              onClick={(e) => {
                e.stopPropagation();
                // Add edit functionality here if needed
              }}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
              type="button"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
