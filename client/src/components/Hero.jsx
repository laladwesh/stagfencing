import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import TopBar from "./TopBar";
import Navbar from "./Navbar";

const STATS = [
  { value: "500+", label: "Fences Built" },
  { value: "2,000+", label: "Fences quoted" },
  { value: "10 yr", label: "Workmanship Warranty" },
];

const SERVICE_TYPES = ["Fence Installation", "Fence Repair", "Gate & Automation", "Retaining Wall"];

function Hero() {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyNav(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative">
      <div
        className={
          "fixed top-4 inset-x-0 z-50 bg-transparent transition-transform duration-300 " +
          (showStickyNav ? "translate-y-0" : "-translate-y-[calc(100%+1rem)]")
        }
      >
        <Navbar />
      </div>

      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,15,10,0.35) 0%, rgba(20,15,10,0.55) 60%, rgba(20,15,10,0.85) 100%), url('/hero-bg.png')",
          backgroundColor: "#3a3226",
        }}
      >
        <header className="relative z-40">
          <TopBar />
          <Navbar />
        </header>
        <div ref={sentinelRef} />

        <div className="px-4 sm:px-6 pt-10 pb-40 sm:pb-48">
        <div className="relative max-w-8xl mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 backdrop-blur text-white text-xs font-medium px-4 py-1.5 rounded-full border border-white/20">
              Trusted by 1,000+ WA homes and businesses
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1]">
              Fencing for homes and businesses. Built to last, priced to suit
            </h1>

            <p className="mt-5 text-gray-200 text-base sm:text-lg max-w-xl">
              Quality fencing for WA homes and businesses, with expert advice, materials
              suited to the local climate, and professional installation. Get a clear
              price before you commit.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="/calculators"
                className="bg-brand-orange hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                Calculate your fence cost
              </a>
              <a
                href="/shop"
                className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-6 py-3 rounded-full transition-colors"
              >
                Shop supplies (DIY)
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-white">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
</svg></span>
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5" />
                  ))}
                </div>
                <span className="font-medium">5.0</span>
              </div>
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <span className="hidden sm:inline w-px h-8 bg-white/30" />
                  <div>
                    <p className="font-semibold leading-none">{stat.value}</p>
                    <p className="text-xs text-gray-300 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex absolute right-0 top-64 lg:top-72 max-w-xs backdrop-blur-md border border-white/10 rounded-md p-4 gap-3 text-white">
            <img
              src="/founder.png"
              alt=""
              className="w-34 h-34 rounded-sm object-cover bg-gray-500 shrink-0"
            />
            <div>
              <p className="text-sm text-gray-200 italic leading-snug">
                "A fence should look sharp the day it goes up and still hold its line
                years later. We build for both."
              </p>
              <p className="mt-2 text-sm font-medium">Aditya</p>
              <p className="text-xs text-gray-300">Founder of Stag Fencing</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-28 sm:-mt-32">
        <form className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-4 gap-3">
          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-1 sm:row-start-1">
            Name*
            <input
              type="text"
              required
              className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-2 sm:row-start-1">
            Email*
            <input
              type="email"
              required
              className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-3 sm:row-start-1">
            Phone No*
            <input
              type="tel"
              required
              className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
            />
          </label>

          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-1 sm:col-span-2 sm:row-start-2">
            Address*
            <input
              type="text"
              required
              className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-3 sm:row-start-2">
            Type Of Service*
            <select className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900">
              {SERVICE_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-1 sm:col-span-2 sm:row-start-3 sm:row-span-2">
            Message
            <textarea
              className="flex-1 bg-transparent border-b border-transparent text-sm text-gray-800 resize-none focus:outline-none focus:border-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-4 text-xs font-medium text-gray-500 sm:col-start-3 sm:row-start-3">
            Remove Existing Fence?*
            <select className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900">
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
          <div className="flex items-end sm:col-start-3 sm:row-start-4">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-full transition-colors"
            >
              Get my free quote
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Hero;
