import my_photo from "../assets/my_photo.jpg";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Link to="/">
        <ArrowLeft
          className="text-white sticky top-0 left-0 ms-12 mt-5"
          size={40}
        />
      </Link>
      {/* Hero Section with Image */}
      <section className="relative py-16 md:py-24 px-4 md:px-12 lg:px-16 bg-linear-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          {/* Your Photo - circular, centered, with subtle glow */}
          <div className="mb-10">
            <div className="inline-block relative">
              <img
                src={my_photo}
                alt="Surjan - Founder of Inkforge AI"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover mx-auto"
              />
            </div>
          </div>

          {/* Main Headline - bright, bigger, eye-catching */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
            About Us – Inkforge AI
          </h1>

          <p className="lg:text-2xl md:text-1xl text-white font-extralight max-w-4xl mx-auto leading-relaxed">
            Welcome to Inkforge AI — where boring blogs meet their end, and
            compelling content creation becomes effortless, creative, and
            actually enjoyable.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
          <p className="text-gray-300 leading-relaxed mb-10">
            Founded by Surjan, a passionate builder from Ludhiana, Punjab,
            Inkforge AI was born out of a simple frustration shared by countless
            creators, marketers, entrepreneurs, and writers: most AI writing
            tools spit out generic, robotic text that feels flat, repetitive,
            and — let's be honest — painfully boring. They solve the "blank
            page" problem but create a new one: uninspired output that doesn't
            engage readers, rank well, or convert.
          </p>
          <p className="text-gray-300 leading-relaxed mb-12">
            We set out to change that.
          </p>
          {/* Mission */}
          <h2 className="text-4xl md:text-5xl font-bold mt-16 mb-8 text-white">
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed mb-10">
            To empower anyone — from solo bloggers and small business owners to
            content agencies and enterprises — to produce high-quality, vibrant,
            human-like articles and blog posts without the usual drudgery. We
            don't just generate text; we help forge ideas into content that
            stands out, captivates audiences, and drives real results.
          </p>
          {/* Differentiators */}{" "}
          <h2 className="text-4xl md:text-5xl font-bold mt-20 mb-10 text-white">
            What Makes Inkforge AI Different?
          </h2>
          <p className="text-gray-300 mb-10">
            Inkforge AI isn't another generic "type prompt → get article" tool.
            We've built it with thoughtful features that address real pain
            points in the content creation workflow:
          </p>
          <ul className="space-y-10 list-none">
            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-gray-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                Idea-First Workflow
              </h3>
              <p>
                You don't need to have everything figured out. Start with a
                rough concept, vague thoughts, or even a single keyword —
                Inkforge AI brainstorms angles, outlines, hooks, and structures
                for you. Think of it as your always-on creative partner who
                sparks ideas when you're stuck.
              </p>
            </li>

            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-gray-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                Vibrant, Multi-Dimensional Writing
              </h3>
              <p>
                Say goodbye to monotonous walls of text. Our AI generates
                content with personality, varied sentence structures, rhetorical
                flair, storytelling elements, and emotional resonance. We
                actively combat "boring blog syndrome" by prioritizing
                engagement, readability, and voice consistency.
              </p>
            </li>

            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-gray-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                Inline Suggestions & Real-Time Enhancement
              </h3>
              <p>
                As you work (or as the AI generates), get smart, contextual
                suggestions right in the editor — better word choices, stronger
                phrasing, tone adjustments, SEO tweaks, fact-check nudges, or
                alternative paragraphs — without leaving your flow.
              </p>
            </li>

            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-pink-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-pink-400 mb-4">
                Stylistic Customization & Visual Polish
              </h3>
              <p>
                Customize output with different tones, reading levels, or brand
                voices. Add emphasis with <strong>bold</strong>,{" "}
                <em>italics</em>, colorful highlights (when exporting to
                compatible formats), bullet points, subheadings, quotes, and
                more — making your content visually appealing from the start.
              </p>
            </li>

            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-gray-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                Grammar, Strength & Quality Engine
              </h3>
              <p>
                Built-in checks go beyond basic grammar: we analyze word
                strength, sentence variety, passive voice overuse, cliché
                detection, readability scores, and overall impact. Every piece
                gets refined to feel polished and professional.
              </p>
            </li>

            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-gray-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                Export Flexibility
              </h3>
              <p>
                Once your content is ready, export seamlessly in multiple
                formats: clean Markdown, HTML (ready for WordPress or websites),
                Google Docs-compatible .docx, PDF for sharing, plain text, or
                even formatted for Medium/Substack/LinkedIn. No more
                reformatting headaches.
              </p>
            </li>

            <li className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-gray-600/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">
                Problem-Solving Core
              </h3>
              <p>
                We tackle the biggest frustrations head-on: writer's block, time
                drain, bland output, SEO struggles, and lack of creativity.
                Inkforge AI turns content creation from a chore into a
                collaborative, satisfying process.
              </p>
            </li>
          </ul>
          {/* Who We Are */}
          <h2 className="text-4xl md:text-5xl font-bold mt-24 mb-8 text-white">
            Who We Are
          </h2>
          <p className="text-gray-300 leading-relaxed mb-10">
            At the heart of Inkforge AI is Surjan, an independent creator and
            builder who experienced these exact struggles firsthand while
            growing projects, writing content, and helping others do the same.
            What started as a personal tool to make blogging faster and more fun
            evolved into a full-fledged product designed for real users like you
            — people who want quality without sacrificing speed or sanity.
          </p>
          <p className="text-gray-300 leading-relaxed mb-10">
            We're still growing, iterating, and listening closely to our early
            users. Every feature is shaped by real feedback from creators who
            refuse to settle for mediocre AI content.
          </p>
          {/* Promise & CTA */}
          <h2 className="text-4xl md:text-5xl font-bold mt-20 mb-8 text-white">
            Our Promise
          </h2>
          <p className="text-gray-300 leading-relaxed text-xl mb-12">
            With Inkforge AI, you'll spend less time wrestling with words and
            more time building your audience, business, or personal brand. We'll
            handle the heavy lifting so your ideas can shine — in full color,
            with strength, personality, and zero boredom.
          </p>
          <div className="text-center mt-16">
            <p className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to forge content that actually matters?
            </p>
            <p className="text-2xl text-gray-300 mb-10">
              Join us at Inkforge AI — where ideas become ink, and boring blogs
              become history.
            </p>
            <p className="text-xl italic text-gray-300">
              Built with passion by Surjan. Powered by AI that understands you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
