import { User, Clock, BookOpen, Download, ArrowLeftCircle } from "lucide-react";
import { UsePosts } from "../hooks/usePosts";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "../components/index";
import { useAuthContext } from "../context/authContext";

export default function PostPageView() {
  const params = useParams();
  const Navigate = useNavigate();
  const { currUser } = useAuthContext();
  const { get_post, loading } = UsePosts();
  const [postData, setPostData] = useState([]);

  const post_username = currUser ? currUser.username : "undefined";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await get_post(params.post_id);
        if (!res.ok) {
          toast.error(res.detail);
          return;
        }

        setPostData(res.data);
      } catch (err) {
        toast.error("Something went wrong? try again!");
        console.error(err);
      }
    };
    fetchPost();
  }, [params.post_id]);

  return (
    <>
      <div id="invoice" className="min-h-screen bg-white ">
        <div className="lg:max-w-6xl sm:max-w-2xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-300">
            <div className="flex items-center gap-5 text-sm text-gray-400 tracking-wide">
              {/* Author */}
              <span className="flex items-center gap-1.5">
                <User size={15} className="text-black" />
                <span className="text-gray-600 font-sans font-medium">
                  {post_username}
                </span>
              </span>

              {/* Date */}
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-black" />
                <span className="font-sans">
                  {" "}
                  {(() => {
                    if (!postData.created_at) return "";
                    const d = new Date(postData.created_at);
                    if (isNaN(d.getTime())) return postData.created_at;
                    return d.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });
                  })()}
                </span>
              </span>

              {/* Post type */}
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-black" />
                <span className="font-sans">{postData.post_type}</span>
              </span>
            </div>

            <div className="flex items-center gap-10 ">
              {/* back button */}
              <Link to="/dashboard">
                <button className="flex items-center gap-1.5 text-lg text-gray-400 hover:text-gray-800 transition-colors duration-200 font-sans tracking-wide">
                  <ArrowLeftCircle size={13} />
                  <span>back</span>
                </button>
              </Link>

              {/* Download */}
              <button className="flex items-center gap-1.5 text-lg text-gray-400 hover:text-gray-800 transition-colors duration-200 font-sans tracking-wide">
                <Download size={13} strokeWidth={1.5} />
                <span>Download</span>
              </button>
            </div>
          </div>
          {loading ? <Loader /> : ""}
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-10 tracking-tight">
            {postData.title}
          </h1>
          {/* Content */}
          <div className="space-y-6">
            <p
              className="text-gray-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  typeof postData.content === "string" ? postData.content : "",
              }}
            ></p>
          </div>
        </div>
      </div>
    </>
  );
}
