import { useState } from "react";
import { Home, FileText, BookOpen, PenSquare, Menu, X } from "lucide-react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = {
    username: "surjan.dev",
    email: "surjan@email.com",
  };

  const posts = [
    { id: 1, title: "Understanding React Hooks", type: "Blog" },
    { id: 2, title: "FastAPI with PostgreSQL", type: "Article" },
    { id: 3, title: "Building AI Agents", type: "Blog" },
    { id: 4, title: "Tailwind Layout Guide", type: "Article" },
    { id: 5, title: "Authentication Deep Dive", type: "Blog" },
    { id: 6, title: "System Design Basics", type: "Article" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Top Menu */}
        <div className="p-6 space-y-6">
          <h1 className="text-xl font-bold tracking-wide">Dashboard</h1>

          <nav className="space-y-4">
            <SidebarItem icon={<Home size={20} />} label="Home" />
            <SidebarItem icon={<FileText size={20} />} label="Articles" />
            <SidebarItem icon={<BookOpen size={20} />} label="Blogs" />
            <SidebarItem icon={<PenSquare size={20} />} label="Write" />
          </nav>
        </div>

        {/* Bottom Email */}
        <div className="p-6 border-t border-gray-800 text-sm text-gray-400">
          {currentUser.email}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 ml-0">
        {/* Username */}
        <h2 className="text-2xl font-semibold underline underline-offset-4 mb-8">
          {currentUser.username}
        </h2>

        {/* Grid Content */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition"
            >
              <span className="text-xs text-gray-400 uppercase">
                {post.type}
              </span>
              <h3 className="mt-2 text-lg font-medium">{post.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white transition">
      {icon}
      <span>{label}</span>
    </div>
  );
}
