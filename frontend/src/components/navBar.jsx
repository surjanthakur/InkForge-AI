import Logo from "../assets/bot-logo.jpg";
import { Menu, XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isCurrentUser } = useAuthContext();
  const authItems = ["Dashboard", "Features", "About", "Editor"];
  const guestItems = ["Features", "About", "Login", "Signup"];

  const navItems = isCurrentUser ? authItems : guestItems;

  return (
    <>
      <nav
        className=" fixed top-0 left-0 right-0 bg-blend-overlay z-50 
    flex items-center justify-between px-6 md:px-8 py-5 
    backdrop-blur-lg backdrop-filter 
    transition-all duration-300"
      >
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="AI Writer Logo"
              className="w-12 h-12 rounded-4xl object-cover transition-all duration-300 hover:scale-110"
            />
            <span className="text-white text-xl font-extralight tracking-wide select-none">
              Inkforge.ai
            </span>
          </a>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) =>
            item === "Features" ? (
              <a
                key={item}
                href="#features"
                className="text-white/50 hover:text-white hover:underline transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                {item}
              </a>
            ) : (
              <Link
                key={item}
                to={item === "About" ? "/about" : `/${item.toLowerCase()}`}
                className="text-white/50 hover:text-white hover:underline transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                {item}
              </Link>
            )
          )}
        </div>

        <div className="md:hidden">
          <Menu
            className="text-white w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black z-50 
        transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <XIcon
            className="text-white w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-6 px-6 mt-10">
          {navItems.map((item) =>
            item === "Features" ? (
              <a
                key={item}
                href="#features"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white text-sm uppercase"
              >
                {item}
              </a>
            ) : (
              <Link
                key={item}
                to={item === "About" ? "/about" : `/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white text-sm uppercase"
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
}
