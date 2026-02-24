import { Download } from "lucide-react";

const PostCard = ({ title, description, type }) => {
  return (
    <div className="bg-white text-black p-5 border border-gray-200 shadow-md">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">{description}</p>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {/* Download Button */}
        <button className="flex items-center gap-2 px-3 py-1 border border-black hover:bg-black hover:text-white transition">
          <Download size={16} />
          Download
        </button>

        {/* Post Type */}
        <span className="text-sm font-medium uppercase">{type}</span>
      </div>
    </div>
  );
};

export default PostCard;
