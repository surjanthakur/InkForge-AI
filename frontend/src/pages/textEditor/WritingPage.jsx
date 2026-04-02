import Placeholder from "@tiptap/extension-placeholder";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ToolBar from "./ToolBar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { UsePosts } from "../../hooks/usePosts.js";

export default function WritingPageEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("blog");
  const [isChatOpen, setIschatOpen] = useState(false);
  const { create_post, loading } = UsePosts();

  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
    ],
    content: "",
  });

  const postData = {
    title,
    post_type: postType,
    content: editor.getHTML(),
  };

  // to save content
  const handleSave = async () => {
    if (!editor || editor.isEmpty) {
      alert("Content cannot be empty");
      return;
    }
    if (!title.trim()) {
      alert("title is required");
      return;
    }

    const res = await create_post(postData);
    if (!res.ok) {
      toast.error(res.error_msg);
      return;
    }
    setTimeout(() => {
      toast.success(res.data?.detail);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center px-4">
      <div className="w-full max-w-5xl py-10 md:py-16 md:ml-10">
        {/* Back Arrow */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-black hover:opacity-70 transition"
          >
            <ArrowLeft size={24} />
            <span className="text-sm md:text-base">Back</span>
          </Link>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Give your story an inspiring title..."
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl md:text-4xl lg:text-5xl font-serif font-semibold bg-transparent outline-none mb-4"
        />

        {/* Editor */}
        <div className="mt-4 md:mt-6 editor-wrapper">
          {editor && <ToolBar editor={editor} />}
          <EditorContent editor={editor} className="ProseMirror" />
        </div>

        {/* Bottom Controls */}
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row gap-4 md:items-center">
          {/* Post Type */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <label className="text-sm font-medium">Post Type</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="border px-3 py-3 text-white rounded-lg cursor-pointer bg-black w-full md:w-auto"
            >
              <option value="blog">blog</option>
              <option value="article">article</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Save */}
            <button
              onClick={handleSave}
              className="w-full sm:w-auto bg-black py-3 px-6 text-white font-medium group rounded-lg"
            >
              {loading ? "saving..." : "save"}
            </button>

            {/* Ask AI */}
            <button
              onClick={() => setIschatOpen(true)}
              className="w-full sm:w-auto px-6 bg-black py-3 text-white font-medium rounded-lg"
            >
              Ask-Ai
            </button>
          </div>

          <ChatWindow
            post_data={postData}
            isOpen={isChatOpen}
            onClose={() => setIschatOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
