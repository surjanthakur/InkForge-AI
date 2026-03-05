import {
  Home,
  PenLine,
  Info,
  Settings,
  LogOut,
  PenToolIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { id: "home", label: "Home", icon: Home, to: "/" },
  { id: "write", label: "Write", icon: PenLine, to: "/editor" },
  { id: "about", label: "About", icon: Info, to: "/about" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

// Remove TypeScript interface, add prop destructure with no types
export function Sidebar({ activeItem, onNavChange }) {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-8 px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            <PenToolIcon size={14} />
          </span>
        </div>
        <span className="text-black font-semibold text-base tracking-tight">
          Inkforge.ai
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={() => onNavChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 w-full text-left
                ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Icon
                size={17}
                className={isActive ? "text-white" : "text-gray-400"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-gray-100" />

        <button
          onClick={() => onNavChange("logout")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150 w-full text-left"
        >
          <LogOut size={24} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
