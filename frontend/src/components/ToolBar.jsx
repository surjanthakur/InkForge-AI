import { Bold, Italic, Code, List, ListOrdered, Heading2 } from "lucide-react";

export default function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div
      className="
      flex items-center gap-1.5 p-2 
      bg-neutral-900/70 backdrop-blur-sm 
      border border-neutral-800 
      rounded-xl shadow-xl
      w-fit mx-auto mb-4
    "
    >
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`
          p-2 rounded-lg transition-all duration-150
          hover:bg-neutral-800/80 active:bg-neutral-700
          ${editor.isActive("bold") ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}
        `}
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} strokeWidth={2.4} />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`
          p-2 rounded-lg transition-all duration-150
          hover:bg-neutral-800/80 active:bg-neutral-700
          ${editor.isActive("italic") ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}
        `}
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} strokeWidth={2.4} />
      </button>

      {/* Heading 2 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`
          p-2 rounded-lg transition-all duration-150
          hover:bg-neutral-800/80 active:bg-neutral-700
          ${editor.isActive("heading", { level: 2 }) ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}
        `}
        title="Heading 2"
      >
        <Heading2 size={18} strokeWidth={2.4} />
      </button>

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`
          p-2 rounded-lg transition-all duration-150
          hover:bg-neutral-800/80 active:bg-neutral-700
          ${editor.isActive("bulletList") ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}
        `}
        title="Bullet List"
      >
        <List size={18} strokeWidth={2.4} />
      </button>

      {/* Ordered List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`
          p-2 rounded-lg transition-all duration-150
          hover:bg-neutral-800/80 active:bg-neutral-700
          ${editor.isActive("orderedList") ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}
        `}
        title="Numbered List"
      >
        <ListOrdered size={18} strokeWidth={2.4} />
      </button>

      {/* Code (inline) */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`
          p-2 rounded-lg transition-all duration-150
          hover:bg-neutral-800/80 active:bg-neutral-700
          ${editor.isActive("code") ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}
        `}
        title="Code"
      >
        <Code size={18} strokeWidth={2.4} />
      </button>

      {/* Optional divider */}
      <div className="w-px h-6 bg-neutral-700 mx-1.5" />
    </div>
  );
}
