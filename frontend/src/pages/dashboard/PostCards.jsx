import { Trash2, DownloadIcon } from "lucide-react";
import DOMPurify from "dompurify";
import PostImage from "../../assets/soft-cartoon.jpeg";
import { UsePosts } from "../../hooks/usePosts";
import { toast } from "react-hot-toast";
import { Loader } from "../../components/index";

export function PostCard({ post, onDelete }) {
  const { download_pdf, loading } = UsePosts();

  const typeBadgeColors = {
    blog: "bg-violet-100 text-violet-600",
    article: "bg-amber-100 text-amber-600",
  };

  const ALLOWED_CONTENT_TAGS = [
    "b",
    "strong",
    "i",
    "em",
    "u",
    "s",
    "strike",
    "del",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "a",
    "span",
  ];

  const decodeHtmlEntities = (value) => {
    if (typeof value !== "string") return "";
    const parser = new DOMParser();
    const decodedDoc = parser.parseFromString(value, "text/html");
    return decodedDoc.documentElement.textContent || value;
  };

  const getPostContent = (content) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content) && typeof content[0]?.content === "string") {
      return content[0].content;
    }
    return "";
  };

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return createdAt;
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handlePdfDownload = async () => {
    try {
      const res = await download_pdf(post.post_id);
      if (!res.ok) {
        toast.error(res.error_msg || "Failed to download pdf");
        return;
      }
      const pdf_url = window.URL.createObjectURL(new Blob([res.data]));
      const pdf_link = document.createElement("a");
      pdf_link.setAttribute("download", `${post.post_id}.pdf`);
      pdf_link.href = pdf_url;
      document.body.appendChild(pdf_link);
      pdf_link.click();
      pdf_link.remove();
      window.URL.revokeObjectURL(pdf_url);
    } catch (err) {
      console.log(err);
    }
  };

  const badgeColor =
    typeBadgeColors[post.post_type] || "bg-gray-100 text-gray-600";
  const formattedCreatedAt = formatCreatedAt(post.created_at);
  const rawContent = getPostContent(post.content);
  const decodedContent = decodeHtmlEntities(rawContent);
  const sanitizedContent = DOMPurify.sanitize(decodedContent, {
    ALLOWED_TAGS: ALLOWED_CONTENT_TAGS,
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  return (
    <>
      {loading ? (
        <span className="text-gray-400 text-sm">
          downloading pdf... <Loader />
        </span>
      ) : (
        ""
      )}
      <div className="flex gap-5 bg-blue-50 rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
        {/* Thumbnail */}
        <div className="shrink-0 w-28 h-28 rounded-xl overflow-hidden border-4 border-black bg-gray-100">
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
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}
                >
                  {post.post_type}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {formattedCreatedAt}
              </p>
              <div
                className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizedContent,
                }}
              />
            </div>

            {/* Actions with Popup */}
            <div className="flex items-center gap-1 shrink-0 relative">
              <button
                onClick={handlePdfDownload}
                type="button"
                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-green-50 hover:text-green-500 flex items-center justify-center text-gray-400 transition-colors"
              >
                {" "}
                <DownloadIcon size={14} />
              </button>

              <button
                onClick={onDelete}
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
    </>
  );
}
