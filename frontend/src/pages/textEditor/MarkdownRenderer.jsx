import ReactMarkdown from "react-markdown";
import "../css/markdown.css";

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
