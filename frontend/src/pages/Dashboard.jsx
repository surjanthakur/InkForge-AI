import { useState } from "react";
import {
  Home,
  FileText,
  BookOpen,
  PenSquare,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const currentUser = {
    username: "surjan.dev",
    email: "surjan@email.com",
  };

  const posts = [
    { id: 1, title: "Understanding React Hooks", type: "BLOG" },
    { id: 2, title: "FastAPI with PostgreSQL", type: "ARTICLE" },
    { id: 3, title: "Building AI Agents", type: "BLOG" },
    { id: 4, title: "Tailwind Layout Guide", type: "ARTICLE" },
    { id: 5, title: "Authentication Deep Dive", type: "BLOG" },
    { id: 6, title: "System Design Basics", type: "ARTICLE" },
  ];

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "articles", label: "Articles", icon: BookOpen },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "write", label: "Write", icon: PenSquare },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-5 left-5 z-50 bg-white text-black p-2 leading-none"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-56 bg-black border-r border-white/10 flex flex-col justify-between z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Top */}
        <div className="p-6 flex flex-col gap-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white font-mono">
            Dashboard
          </span>

          <nav className="flex flex-col gap-0.5">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveNav(id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors text-left
                  ${
                    activeNav === id
                      ? "bg-white text-black"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-6 border-t border-white/10 font-mono  text-white tracking-wide">
          {currentUser.email}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 md:p-12">
        {/* Header */}
        <div className="mb-12 pb-6 flex border-b border-white/10">
          <a className="mt-3" href="/">
            <ArrowLeft size={25} />
          </a>
          <h1 className="text-4xl  ms-14 font-extrabold tracking-tight leading-none">
            {currentUser.username}
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-black p-6 flex flex-col gap-3 group cursor-pointer transition-colors relative"
            >
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-white/30 uppercase">
                <span className="w-1 h-1 rounded-full bg-white inline-block" />
                {post.type}
              </span>
              <h3 className="text-base font-bold leading-snug tracking-tight text-white pr-6">
                {post.title}
              </h3>
              <span className="absolute bottom-5 right-5 text-white/15 text-lg group-hover:text-white/60 transition-colors">
                →
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
