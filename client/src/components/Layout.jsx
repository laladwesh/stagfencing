import { useEffect, useRef, useState } from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children, transparentHeader = false }) {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (transparentHeader) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyNav(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [transparentHeader]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!transparentHeader && (
        <>
          <div
            className={
              "fixed top-4 inset-x-0 z-50 bg-transparent transition-transform duration-300 " +
              (showStickyNav ? "translate-y-0" : "-translate-y-[calc(100%+1rem)]")
            }
          >
            <Navbar />
          </div>

          <div className="bg-brand-orange shadow-sm">
            <TopBar />
            <Navbar />
          </div>
          <div ref={sentinelRef} />
        </>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
