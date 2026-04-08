import { ArrowRight, BookOpen, Brush, Download, EditIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import MainBackgroundImage from "../assets/Wallpaper.jpeg";
import sideIllustrationImage from "../assets/bot-logo.jpeg";
import { FeatureCard } from "../components/index.js";
import { useAuthContext } from "../context/authContext.jsx";

export default function Homepage() {
  const { isCurrentUser } = useAuthContext();
  const featureData = [
    {
      icon: <Brush size={22} strokeWidth={1.5} className="text-zinc-400" />,
      title: "Customizable Colors & Formats",
      description:
        "Craft your content your way. Tailor fonts, palettes, heading styles,and layouts to match your brand’s unique voice.",
    },
    {
      icon: <Download size={22} strokeWidth={1.5} className="text-zinc-400" />,
      title: "Flexible Export Options",
      description:
        " Export as polished PDF, crisp image, Markdown, or plain HTML with a single click.",
    },
    {
      icon: <EditIcon size={22} strokeWidth={1.5} className="text-zinc-400" />,
      title: "Inline Grammar Suggestions",
      description:
        "AI-powered grammar and style hints appear inline as you type.",
    },
    {
      icon: <BookOpen size={22} strokeWidth={1.5} className="text-zinc-400" />,
      title: "Personal Blog Collection",
      description: " Organize, revisit, and refine every piece you’ve written.",
    },
  ];

  return (
    <div className="min-h-fit sm:mt-14 flex flex-col bg-black">
      <section className="relative grow border-zinc-500 border-b flex items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
        {/* Background image */}
        <img
          alt="main-image"
          src={MainBackgroundImage}
          className="absolute inset-0 w-full h-full object-cover backdrop-blur-3xl opacity-50"
        />

        {/* Content Container - Left text, Right image */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-left space-y-6 md:space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="sm:text-2xl md:text-4xl lg:text-6xl  font-medium leading-tight tracking-wide text-gray-100"
            >
              <span className="block mt-4 md:mt-6 text-lime-300">
                Let your ideas breathe
              </span>
              <span className="block">words flow, and your stories find</span>
              <span className="block mt-2 md:mt-4 text-lime-300">
                their shape
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="sm:text-lg md:text-2xl text-gray-400 font-extralight max-w-4xl mx-auto leading-relaxed"
            >
              Publish it — with an AI companion that refines every sentence and
              makes your voice shine.
            </motion.p>

            {/* editor route */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="pt-6 md:pt-10 flex justify-start"
            >
              <Link
                to={isCurrentUser ? "/editor" : "/login"}
                state={!isCurrentUser ? { fromEditor: true } : undefined}
                className=" flex items-center gap-2 px-10 py-5 lg:text-lg md:text-xl font-light text-white border-2 border-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] hover:text-black hover:bg-lime-400"
              >
                write your Story
                <ArrowRight size={20} className="md:w-6 md:h-6" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Additional Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <img
              alt="hero-illustration"
              src={sideIllustrationImage}
              className="h-auto w-full max-w-md rounded-lg lg:max-w-lg xl:max-w-xl object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* fetures of the product*/}
      <section id="features" className="bg-black text-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center space-y-6 mb-20">
            <p className="text-xs tracking-[0.35em] text-zinc-500">
              WHAT'S INSIDE
            </p>

            <h2 className="text-3xl md:text-5xl text-lime-300 font-serif font-medium">
              Everything a writer needs,{" "}
              <span className="italic text-zinc-400">nothing they don’t.</span>
            </h2>
          </div>

          {/* Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 border-2 border-zinc-800 rounded-xl overflow-hidden">
              {featureData.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`
            border-zinc-800
            ${index === 0 ? "bg-linear-to-br from-zinc-800/60 to-black" : "bg-black"}
            ${index % 2 === 0 ? "md:border-r-2" : ""}
            ${index < 2 ? "md:border-b-2" : ""}
            border-b md:border-b-0
          `}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </motion.div>
          <p
            className="text-center mt-20 text-white/30 tracking-widest uppercase text-xs"
            style={{ fontFamily: "monospace" }}
          >
            Dream · Create · Refine
          </p>
        </div>
      </section>
    </div>
  );
}
