import { useState, useRef, useEffect } from "react";
import { MoreVertical, ImageIcon, DownloadIcon } from "lucide-react";

export default function PopupMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="More"
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center text-gray-400 transition-colors"
        tabIndex={0}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="z-50 absolute right-0 mt-2 w-max bg-white border border-gray-100 rounded-lg shadow-lg flex flex-col">
          <button className="flex items-center gap-2 text-sm px-4 py-2 text-gray-800 hover:bg-gray-50 rounded-t-lg text-left">
            <DownloadIcon size={16} className="text-amber-500" />
            Download as PDF
          </button>
          <button className="flex items-center gap-2 text-sm px-4 py-2 text-gray-800 hover:bg-gray-50 rounded-b-lg text-left">
            <ImageIcon size={16} className="text-blue-500" />
            Download as Image
          </button>
        </div>
      )}
    </div>
  );
}
