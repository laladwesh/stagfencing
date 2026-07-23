import { useState } from "react";

function ArrowIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 1.875C10.5 1.77554 10.4605 1.68016 10.3902 1.60984C10.3198 1.53951 10.2244 1.5 10.125 1.5H5.62498C5.52553 1.5 5.43015 1.53951 5.35982 1.60984C5.28949 1.68016 5.24998 1.77554 5.24998 1.875C5.24998 1.97446 5.28949 2.06984 5.35982 2.14016C5.43015 2.21049 5.52553 2.25 5.62498 2.25H9.21973L1.60949 9.8595C1.57462 9.89437 1.54696 9.93576 1.52809 9.98131C1.50922 10.0269 1.49951 10.0757 1.49951 10.125C1.49951 10.1743 1.50922 10.2231 1.52809 10.2687C1.54696 10.3142 1.57462 10.3556 1.60949 10.3905C1.64435 10.4254 1.68574 10.453 1.7313 10.4719C1.77685 10.4908 1.82568 10.5005 1.87499 10.5005C1.92429 10.5005 1.97312 10.4908 2.01867 10.4719C2.06423 10.453 2.10562 10.4254 2.14049 10.3905L9.74998 2.78025V6.375C9.74998 6.47446 9.78949 6.56984 9.85982 6.64016C9.93015 6.71049 10.0255 6.75 10.125 6.75C10.2244 6.75 10.3198 6.71049 10.3902 6.64016C10.4605 6.56984 10.5 6.47446 10.5 6.375V1.875Z"
        fill="currentColor"
      />
    </svg>
  );
}

const VISIBLE_COUNT = 3;

const ARTICLES = [
  {
    title: "5 Popular Fence Styles To Transform Your Yard",
    tag: "Instructions",
    date: "March 18, 2025",
    readTime: "7 min read",
  },
  {
    title: "5 Popular Fence Styles To Transform Your Yard",
    tag: "Instructions",
    date: "March 18, 2025",
    readTime: "7 min read",
  },
  {
    title: "5 Popular Fence Styles To Transform Your Yard",
    tag: "Instructions",
    date: "March 18, 2025",
    readTime: "7 min read",
  },
  {
    title: "How Much Does A Colorbond Fence Cost in Perth?",
    tag: "Pricing",
    date: "March 25, 2025",
    readTime: "5 min read",
  },
  {
    title: "Do You Need Council Approval For A New Fence?",
    tag: "Guides",
    date: "April 2, 2025",
    readTime: "6 min read",
  },
  {
    title: "Asbestos Fence Removal: What Perth Homeowners Should Know",
    tag: "Safety",
    date: "April 10, 2025",
    readTime: "8 min read",
  },
];

function Articles() {
  const maxStart = Math.max(0, ARTICLES.length - VISIBLE_COUNT);
  const [start, setStart] = useState(0);
  const slides = Array.from({ length: maxStart + 1 }, (_, s) => ARTICLES.slice(s, s + VISIBLE_COUNT));

  const showPrev = () => setStart((s) => Math.max(0, s - 1));
  const showNext = () => setStart((s) => Math.min(maxStart, s + 1));

  return (
    <section className="bg-white py-16 sm:py-24 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            ARTICLES
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold text-black leading-tight">
            Fencing advice worth reading
          </h2>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={showPrev}
            disabled={start === 0}
            aria-label="Previous articles"
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowIcon className="rotate-[225deg]" />
          </button>
          <button
            type="button"
            onClick={showNext}
            disabled={start === maxStart}
            aria-label="Next articles"
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowIcon className="rotate-45" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${start * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full shrink-0 pr-6">
                {slide.map((article, i) => (
                  <div key={`${article.title}-${i}`}>
                    <div className="relative rounded-xl overflow-hidden">
                      <img src="/hero-bg.png" alt="" className="w-full h-48 object-cover" />
                      <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                        🕐 {article.readTime}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-full shrink-0">
                        {article.tag}
                      </span>
                      <span className="flex-1 border-t border-dashed border-gray-300" />
                      <span className="text-xs text-gray-400 shrink-0">{article.date}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-black leading-snug">{article.title}</h3>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/blog"
            className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
          >
            Read more articles
            <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
              <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Articles;
