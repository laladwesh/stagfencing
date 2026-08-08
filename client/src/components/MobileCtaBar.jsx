import { Link, useLocation } from "react-router-dom";

function MobileCtaBar() {
  const location = useLocation();
  if (location.pathname === "/request-a-quote") return null;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
      <a
        href="tel:0431703770"
        className="flex-1 inline-flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-full transition-colors whitespace-nowrap"
      >
        Call 0431 703 770
      </a>
      <Link
        to="/request-a-quote"
        className="flex-1 inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors whitespace-nowrap"
      >
        Get A Free Quote
      </Link>
    </div>
  );
}

export default MobileCtaBar;
