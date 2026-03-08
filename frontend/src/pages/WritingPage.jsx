import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { UsePosts } from "../hooks/usePosts";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/editor.css";

export default function WritingPageEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("blog");
  const { create_post } = UsePosts();

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

  const handleSave = async () => {
    if (!editor) return;

    const postData = {
      title,
      post_type: postType,
      content: editor.getJSON(),
    };
    const res = await create_post(postData);
    if (!res.ok) {
      toast.error(res.detail);
      return;
    }
    setTimeout(() => {
      toast.success(res.data?.detail);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center">
      <div className="w-full lg:max-w-6xl  md:max-w-5xl px-6 py-16">
        {/* Back Arrow */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-black hover:opacity-70 transition"
          >
            <ArrowLeft size={28} />
          </Link>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-serif font-semibold bg-transparent outline-none mb-2"
        />

        {/* Editor */}
        <div className="mt-6 editor-wrapper">
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className="editor-bubble-menu"
            >
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`editor-bubble-btn ${editor.isActive("bold") ? "is-active" : ""}`}
                title="Bold"
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`editor-bubble-btn ${editor.isActive("italic") ? "is-active" : ""}`}
                title="Italic"
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`editor-bubble-btn ${editor.isActive("strike") ? "is-active" : ""}`}
                title="Strikethrough"
              >
                <Strikethrough size={18} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`editor-bubble-btn ${editor.isActive("underline") ? "is-active" : ""}`}
                title="Underline"
              >
                <UnderlineIcon size={18} />
              </button>
            </BubbleMenu>
          )}
          <EditorContent editor={editor} className="ProseMirror" />
        </div>

        <div className="mt-10 gap-3 flex flex-row">
          {/* post type options */}
          <div className="flex gap-3">
            <label className="block text-sm font-medium">Post Type</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className=" border px-3 py-2 text-white rounded-2xl cursor-pointer bg-linear-to-b from-black to-gray-500"
            >
              <option value="blog">Blog</option>
              <option value="article">Article</option>
            </select>
          </div>

          {/* save button */}
          <button
            onClick={handleSave}
            className="cursor-pointer bg-linear-to-b from-black to-gray-500 py-3 rounded-2xl text-white font-medium group"
            style={{
              minWidth: "90px",
              width: "auto",
              paddingLeft: "2.25rem",
              paddingRight: "2.25rem",
            }}
          >
            <div className="relative overflow-hidden flex justify-center items-center">
              <p
                className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] px-2"
                style={{ whiteSpace: "nowrap" }}
              >
                save
              </p>
              <p
                className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                style={{ whiteSpace: "nowrap", width: "100%" }}
              >
                {postType}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
