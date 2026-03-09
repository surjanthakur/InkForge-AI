import { TwitchIcon, Github, Linkedin, Mail } from "lucide-react";
import logoImage from "../assets/bot-logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-white mt-20">
      {/* ───────── Top Footer ───────── */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="AI Writer Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="font-serif text-white/90 font-semibold tracking-wide">
              AI<span className="text-white/40 mx-1">·</span>Writer
            </span>
          </div>

          <p className="text-sm text-white/40 leading-relaxed">
            Helping writers dream bigger, write smarter, and publish with
            confidence.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5 mt-2">
            <a href="#" className="text-white/30 hover:text-white transition">
              <TwitchIcon size={18} />
            </a>
            <a href="#" className="text-white/30 hover:text-white transition">
              <Github size={18} />
            </a>
            <a href="#" className="text-white/30 hover:text-white transition">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Links Columns */}
        {[
          {
            heading: "Product",
            links: [
              "Editor",
              "Features",
              "Export Options",
              "Grammar AI",
              "Blog Collection",
            ],
          },
          {
            heading: "Resources",
            links: ["Documentation", "Changelog", "Blog", "Tutorials", "API"],
          },
          {
            heading: "Company",
            links: [
              "About",
              "Careers",
              "Privacy Policy",
              "Terms of Service",
              "Contact",
            ],
          },
        ].map((col) => (
          <div key={col.heading} className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-mono">
              {col.heading}
            </p>

            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ───────── Newsletter Strip ───────── */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="italic font-serif text-white/40">
            Get writing tips & updates in your inbox.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-white/5 border border-white/20 border-r-0 text-white/80 px-4 py-2 text-sm font-mono outline-none rounded-l-sm w-56"
            />
            <button className="bg-white text-black px-5 py-2 text-xs tracking-widest uppercase font-mono rounded-r-sm hover:bg-gray-200 transition flex items-center gap-2">
              Subscribe
              <Mail size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ───────── Bottom Bar ───────── */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-white/30 tracking-wide">
            © 2026 AI·Writer. All rights reserved.
          </p>
          <p className="text-xs font-mono text-white/20 tracking-widest">
            DREAM · CREATE · REFINE
          </p>
        </div>
      </div>
    </footer>
  );
}
