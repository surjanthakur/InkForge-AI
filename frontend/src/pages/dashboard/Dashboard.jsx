import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PostCard } from "./PostCards";
import { PenLine, Search, Menu, X } from "lucide-react";
import { UsePosts } from "../../hooks/usePosts";
import { toast } from "react-hot-toast";

const FILTERS = ["All", "Blog", "Article"];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("home");
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { all_posts, error } = UsePosts();

  // --- Filter posts by type and search query ---
  const filteredPosts = posts.filter((post) => {
    const typeMatch = activeFilter === "All" || post.type === activeFilter;
    const searchMatch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  // --- Fetch all posts on mount ---
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        const res = await all_posts();
        if (isMounted) {
          setPosts(res);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(error);
          console.error(err);
          setPosts([]);
        }
      }
    };
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Handlers ---
  const handleDelete = (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const handleEdit = (id) => {
    alert(`Edit post #${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          activeItem={activeNav}
          onNavChange={(id) => {
            setActiveNav(id);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <span className="text-sm text-gray-700 font-medium">Dashboard</span>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">AJ</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header username="Alyssa Jones" avatarInitials="AJ" />
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-5xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-linear-to-r from-violet-100 via-purple-50 to-indigo-50 border border-violet-100 px-8 py-6 flex items-center justify-between overflow-hidden relative">
            <div>
              <h2 className="text-gray-900 text-2xl">Hi, Alyssa 👋</h2>
              <p className="text-gray-500 text-sm mt-1">
                Ready to write something great today?
              </p>
              <button
                onClick={() => setActiveNav("write")}
                className="mt-4 inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <PenLine size={14} />
                New Post
              </button>
            </div>
            <div className="hidden sm:block shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-white/60 border border-violet-100 flex items-center justify-center">
                <PenLine size={40} className="text-violet-300" />
              </div>
            </div>
          </div>

          {/* Overview, Filters */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-gray-700">Overview</h3>
                <p className="text-xs text-gray-400">
                  {filteredPosts.length} post
                  {filteredPosts.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-xl text-sm transition-all duration-150 ${
                    activeFilter === filter
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Post Cards */}
          <div className="space-y-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <PostCard
                  key={idx}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Search size={20} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No posts found</p>
                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs text-indigo-500 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
