import { BubbleMenu } from "@tiptap/react/menus";

import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import "../css/editor.css";

export default function ToolBar({ editor }) {
  return (
    <>
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
    </>
  );
}
