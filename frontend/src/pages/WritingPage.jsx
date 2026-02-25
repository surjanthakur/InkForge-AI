import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Toolbar } from "../components/index";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function WritingPageEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("blog");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
    ],
    content: "",
  });

  const handleSave = async () => {
    if (!editor) return;

    const blogData = {
      title,
      description,
      content: editor.getJSON(),
    };

    // api call
    console.log(blogData);

    if (!editor) return null;
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
          className="w-full text-5xl font-serif font-semibold bg-transparent outline-none mb-4"
        />

        {/* Description */}
        <textarea
          placeholder="Write a short description..."
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-lg text-zinc-600 bg-transparent outline-none resize-none mb-8"
        />

        <div className="border-t border-zinc-300 mb-8"></div>

        {/* Toolbar component */}
        <Toolbar editor={editor} />

        {/* Editor */}
        <EditorContent
          editor={editor}
          className="
    prose prose-lg text-2xl max-w-none text-gray-800 p-4 rounded-md bg-white
    border border-gray-300 font-sans
  "
        />
        <div className="mt-10 gap-3 flex flex-row">
          {/* post type options */}
          <div className="flex gap-3">
            <label className="block text-sm font-medium">Post Type</label>
            <select className=" border px-3 py-2 text-white rounded-2xl cursor-pointer bg-linear-to-b from-black to-gray-500">
              <option value="blog">Blog</option>
              <option value="article">Article</option>
            </select>
          </div>
          {/* save button */}
          <button
            onClick={handleSave}
            class="cursor-pointer bg-linear-to-b from-black to-gray-500 px-6 py-3 rounded-2xl text-white font-medium group"
          >
            <div class="relative overflow-hidden">
              <p class="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                save
              </p>
              <p class="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                save
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
