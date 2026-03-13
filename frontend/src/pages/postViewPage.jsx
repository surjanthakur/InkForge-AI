import { User, Clock, BookOpen, Download } from "lucide-react";
import { UsePosts } from "../hooks/usePosts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PostPageView() {
  const Navigate = useNavigate();
  const { get_post, loading } = UsePosts();
  const [postData, setPostData] = useState([]);

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Outer container */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-5 text-sm text-gray-400 tracking-wide">
            {/* Author */}
            <span className="flex items-center gap-1.5">
              <User size={13} strokeWidth={1.5} className="text-gray-300" />
              <span className="text-gray-600 font-sans font-medium">
                {/* {post.author} */}
              </span>
            </span>

            {/* Date */}
            <span className="flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.5} className="text-gray-300" />
              {/* <span className="font-sans">{post.created_at}</span> */}
            </span>

            {/* Post type */}
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} strokeWidth={1.5} className="text-gray-300" />
              {/* <span className="font-sans">{formatType(post.post_type)}</span> */}
            </span>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-800 transition-colors duration-200 font-sans tracking-wide"
          >
            <Download size={13} strokeWidth={1.5} />
            <span>Download</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-10 tracking-tight">
          {/* {post.title} */}
        </h1>

        {/* Content */}
        <div className="space-y-6">
          {/* {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-gray-700 text-base leading-relaxed">
              {para}
            </p>
          ))} */}
        </div>
      </div>
    </div>
  );
}
