import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PostCard } from "./PostCards";
import { PenLine, Search, Menu } from "lucide-react";
import { UsePosts } from "../../hooks/usePosts";
import { useAuthContext } from "../../context/authContext";
import { toast } from "react-hot-toast";
import { Loader } from "../../components/index";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("home");
  const [activeFilter, setActiveFilter] = useState("blog");
  const [posts, setPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetch_posts, delete_post, loading } = UsePosts();
  const { currUser } = useAuthContext();
  const FILTERS = ["all", "blog", "article"];

  const isLoading = loading;

  const safePosts = Array.isArray(posts) ? posts : [];
  const postsCount = safePosts.length;

  const displayName = currUser?.username || "User";

  const avatarInitials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // func to delete post and refresh posts after deletion
  const handle_delete = async (post_id) => {
    const res = await delete_post(post_id);
    if (!res.ok) {
      toast.error(res.detail);
      return;
    }
    toast.success(res.data?.detail);
    // Refresh posts with the current filter
    const result = await fetch_posts({ query: activeFilter });
    if (result.ok) {
      setPosts(result.data);
    }
  };

  useEffect(() => {
    // func to load post
    const loadPosts = async () => {
      const result = await fetch_posts({ query: activeFilter });
      if (result.ok) {
        setPosts(result.data);
      } else {
        return;
      }
    };
    loadPosts();
  }, [activeFilter]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/25 backdrop-blur-sm">
          <Loader />
        </div>
      )}
      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  lg:translate-x-0`}
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
      <div className="flex-1 flex flex-col min-w-0 lg:ml-56">
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
            <span className="text-white text-xs font-semibold">
              {avatarInitials}
            </span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-50 bg-white">
          <Header username={displayName} avatarInitials={avatarInitials} />
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-5xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-linear-to-r from-violet-100 via-purple-50 to-indigo-50 border border-violet-100 px-8 py-6 flex items-center justify-between overflow-hidden relative">
            <div>
              <h2 className="text-gray-900 text-2xl">Hi, {displayName} 👋</h2>
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
                  {postsCount} post
                  {postsCount !== 1 ? "s" : ""} found
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
            {safePosts.length > 0 ? (
              safePosts.map((post) => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  onDelete={() => handle_delete(post.post_id)}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Search size={20} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No posts found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
