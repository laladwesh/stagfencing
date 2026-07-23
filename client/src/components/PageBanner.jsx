import { useEffect, useRef, useState } from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";

function PageBanner({ breadcrumb, title, subtitle, children }) {
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
    <div className="relative">
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
            "linear-gradient(180deg, rgba(20,15,10,0.55) 0%, rgba(20,15,10,0.65) 100%), url('/hero-bg.png')",
        }}
      >
        <header className="relative z-40">
          <TopBar />
          <Navbar />
        </header>
        <div ref={sentinelRef} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center text-white">
          <p className="text-xs text-gray-300">{breadcrumb}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-3 text-gray-200">{subtitle}</p>}
          {children && <div className="mt-6 flex items-center justify-center gap-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export default PageBanner;
