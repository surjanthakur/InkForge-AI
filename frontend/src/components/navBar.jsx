import Logo from '../assets/botLogo.jpeg';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blend-overlay z-20 flex items-center justify-between px-8 py-5">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img
          src={Logo}
          alt="AI Writer Logo"
          className="w-12 h-12 rounded-4xl object-cover transition-all duration-300 hover:shadow-2xl hover:scale-110"
        />

        <span className="text-white/90 font-semibold tracking-wide lg:text-lg sm:text-sm font-serif">
          AI<span className="text-white/40 mx-1">·</span>Writer
        </span>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex items-center gap-10">
        {['Features', 'About', 'Editor', 'Login', 'Signup'].map((item) => (
          <a
            key={item}
            href={
              item === 'Editor'
                ? '/editor'
                : item === 'Login'
                  ? '/login'
                  : item === 'Signup'
                    ? '/signup'
                    : `#${item.toLowerCase()}`
            }
            className="text-white/50 hover:text-white transition-colors duration-300 text-sm tracking-widest uppercase"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <Menu className="text-white/80 w-6 h-6 cursor-pointer" />
      </div>
    </nav>
  );
}
