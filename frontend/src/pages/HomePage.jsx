import { ArrowRight, BookOpen, Brush, Download, EditIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gradientVideo from "../assets/gradient-sound.mp4";
import { FeatureCard } from "../components/index";
import { useAuthContext } from "../context/authContext";
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
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleEnd = () => {
      video.pause();
    };

    video.addEventListener("ended", handleEnd);
    return () => {
      video.removeEventListener("ended", handleEnd);
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <section className="relative grow flex items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={gradientVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10 md:space-y-14">
          <h1 className="sm:text-2xl md:text-4xl lg:text-6xl font-serif font-medium leading-tight tracking-wide text-gray-100">
            <span className="block">"Every blank page is an invitation.</span>
            <span className="block mt-4 md:mt-6 text-gray-400">
              Let your ideas breathe,
            </span>
            <span className="block">words flow, and your stories find</span>
            <span className="block mt-2 md:mt-4 text-gray-400">
              their shape."
            </span>
          </h1>

          <p className="sm:text-lg md:text-2xl text-gray-400 font-extralight max-w-4xl mx-auto leading-relaxed">
            Dream it. Draft it. Publish it — with an AI companion that refines
            every sentence and makes your voice shine.
          </p>

          {/* editor route */}
          <div className="pt-6 md:pt-10 flex justify-center">
            <Link
              to={isCurrentUser ? "/editor" : "/login"}
              state={!isCurrentUser ? { fromEditor: true } : undefined}
              className=" flex items-center gap-2 px-10 py-5 lg:text-lg md:text-xl font-light text-white border-2 border-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] hover:text-black hover:bg-white"
            >
              write something
              <ArrowRight size={25} />
            </Link>
          </div>
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

            <h2 className="text-3xl md:text-5xl font-serif font-medium">
              Everything a writer needs,{" "}
              <span className="italic text-zinc-400">nothing they don’t.</span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 border-2 border-zinc-800 rounded-xl overflow-hidden">
            {featureData.map((feature, index) => (
              <div
                key={index}
                className={`
            border-zinc-800
            ${index === 0 ? "bg-linear-to-br from-zinc-800/60 to-black" : "bg-black"}
            ${index % 2 === 0 ? "md:border-r-2" : ""}
            ${index < 2 ? "md:border-b-2" : ""}
            border-b md:border-b-0
          `}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
          <p
            className="text-center mt-20 text-white/20 tracking-widest uppercase text-xs"
            style={{ fontFamily: "monospace" }}
          >
            Dream · Create · Refine
          </p>
        </div>
      </section>
    </div>
  );
}
