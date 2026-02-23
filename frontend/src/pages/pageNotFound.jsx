import { Link } from 'react-router-dom'; // or next/link if using Next.js

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-black dark:bg-black flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">
        {/* Big 404 */}
        <h1 className="text-8xl sm:text-9xl font-black text-gray-300 dark:text-gray-800 tracking-tight">
          404
        </h1>

        {/* Main message */}
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h2>

        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
          <br className="hidden sm:block" />
          It may have been moved, renamed, or is temporarily unavailable.
        </p>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 
                     text-base font-medium  text-black bg-white 
                     hover:bg-zinc-500 hover:text-white focus:outline-none focus:ring-2 transition-colors"
          >
            ⬅️ Back to Home
          </Link>
        </div>

        {/* Optional cute illustration / easter egg */}
        <div className="mt-12 opacity-70">
          <p className="text-sm text-gray-500 dark:text-gray-600 font-mono">
            (sad robot noises) beep boop 404...
          </p>
        </div>
      </div>
    </div>
  );
}
