import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArrowIcon from "../ArrowIcon";
import { searchProducts, getSearchSuggestions } from "../../lib/api";

const QUICK_LINKS = [
  { label: "Shop all products", href: "/shop" },
  { label: "All services", href: "/services" },
  { label: "Fencing calculators", href: "/calculators" },
  { label: "Gallery", href: "/gallery" },
];

const VISIBLE_COUNT = 4;

function ProductCard({ product, onClick }) {
  const hasRange = product.priceMin !== product.priceMax;
  return (
    <Link to={`/product/${product.slug}`} onClick={onClick} className="block group">
      <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">{product.category?.name}</p>
      <p className="mt-0.5 text-sm font-medium text-black leading-snug line-clamp-2">{product.name}</p>
      <p className="mt-1 text-sm">
        {product.compareAtPrice ? (
          <>
            <span className="text-gray-400 line-through mr-1.5">${product.compareAtPrice.toFixed(2)}</span>
            <span className="text-brand-orange font-semibold">${product.priceMin?.toFixed(2)}</span>
          </>
        ) : (
          <span className="text-gray-700">
            {hasRange ? `$${product.priceMin?.toFixed(2)} - $${product.priceMax?.toFixed(2)}` : `$${product.priceMin?.toFixed(2)}`}
          </span>
        )}
      </p>
    </Link>
  );
}

function ProductCarousel({ title, products, onNavigate }) {
  const maxStart = Math.max(0, products.length - VISIBLE_COUNT);
  const [start, setStart] = useState(0);

  if (!products.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-black">{title}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={start === 0}
            aria-label="Previous"
            className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowIcon className="rotate-[225deg]" />
          </button>
          <button
            type="button"
            onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
            disabled={start === maxStart}
            aria-label="Next"
            className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowIcon className="rotate-45" />
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(calc(-${start} * (100% + 1.25rem) / ${VISIBLE_COUNT}))` }}
        >
          {products.map((product) => (
            <div key={product._id} className="w-[calc((100%-3.75rem)/4)] shrink-0">
              <ProductCard product={product} onClick={onNavigate} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchModal({ onClose, anchored = true }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState({ popularSearches: [], recommended: [] });
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    getSearchSuggestions()
      .then(setSuggestions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(() => {
      searchProducts(trimmed)
        .then((data) => setResults(data.results))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className={
        "z-[70] bg-white rounded-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 " +
        (anchored
          ? "absolute top-full right-0 mt-3 w-[92vw] sm:w-[640px] max-w-[640px]"
          : "fixed top-20 inset-x-4")
      }
    >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M8.33333 14.1667C11.555 14.1667 14.1667 11.555 14.1667 8.33333C14.1667 5.11167 11.555 2.5 8.33333 2.5C5.11167 2.5 2.5 5.11167 2.5 8.33333C2.5 11.555 5.11167 14.1667 8.33333 14.1667Z"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M17.5 17.5L12.5 12.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 min-w-0 text-base focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-medium text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            Esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {query.trim() ? (
            <div className="p-5">
              {searching ? (
                <p className="text-sm text-gray-500">Searching…</p>
              ) : results.length === 0 ? (
                <p className="text-sm text-gray-500">No products found for &quot;{query}&quot;.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {results.map((product) => (
                    <ProductCard key={product._id} product={product} onClick={onClose} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 p-5">
              <div className="sm:w-48 shrink-0 space-y-6">
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-gray-400">POPULAR SEARCHES</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {suggestions.popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-2.5 py-1 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-gray-400">QUICK LINKS</p>
                  <ul className="mt-2 space-y-1.5">
                    {QUICK_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          onClick={onClose}
                          className="text-sm text-gray-700 hover:text-black transition-colors"
                        >
                          {link.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <ProductCarousel
                  title="Recommended products"
                  products={suggestions.recommended}
                  onNavigate={onClose}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center justify-between px-5 py-3 border-t border-gray-100 text-[11px] text-gray-400 shrink-0">
          <span>↵ Search · Esc or click outside to close · &quot;/&quot; opens search anywhere</span>
          <span>Recommendations: admin-pinned first, then best-sellers. Popular searches: we query analytics.</span>
        </div>
    </div>
  );
}

export default SearchModal;
