import { useState } from "react";
import { Link } from "react-router-dom";

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

const VISIBLE_COUNT = 4;

const POPULAR_PRODUCTS = [
  { title: "Aluminium Slat – 65 x 16.5 x 6100mm long", price: "$54.00" },
  {
    title: "Colorbond Fencing Panel – (2.4m long) 3x Sheets, 2x Posts, 2x Rails, Screws",
    price: "$99.50 – $146.80",
  },
  { title: "Colorbond® Steel Posts – Varies Size Options", price: "$9.10 – $18.80" },
  { title: "PVC – New England Fencing Panel 2350mm wide x 1150mm high.", price: "$140.00" },
  { title: "Colorbond® Fence Gate – Single Leaf 900mm", price: "$180.00" },
  { title: "Aluminium Pool Fence Panel – Flat Top 2400mm", price: "$210.00" },
];

const AFFORDABLE_PRODUCTS = [
  { title: "Tubular – Raked Flat Top – 1800mm down to 1200mm – WHITE", price: "$230.00 – $260.00" },
  { title: "Tubular – Raked Flat Top – 1800mm down to 1200mm – GREY", price: "$240.00 – $270.00" },
  { title: "Tubular – Raked Flat Top – 1800mm down to 1200mm – RED", price: "$250.00 – $280.00" },
  { title: "Tubular – Raked Flat Top – 1800mm down to 1200mm – BLUE", price: "$260.00 – $290.00" },
  { title: "Tubular – Raked Flat Top – 1800mm down to 1200mm – BLACK", price: "$255.00 – $285.00" },
  { title: "Tubular – Raked Flat Top – 1800mm down to 1200mm – GREEN", price: "$245.00 – $275.00" },
];

function ProductRow({ title, products, showIntro }) {
  const maxStart = Math.max(0, products.length - VISIBLE_COUNT);
  const [start, setStart] = useState(0);
  const slides = Array.from({ length: maxStart + 1 }, (_, s) => products.slice(s, s + VISIBLE_COUNT));

  const showPrev = () => setStart((s) => Math.max(0, s - 1));
  const showNext = () => setStart((s) => Math.min(maxStart, s + 1));

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          {showIntro && (
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              OUR DIY RANGE
            </span>
          )}
          <h2 className={"text-3xl sm:text-4xl font-semibold text-black " + (showIntro ? "mt-4" : "")}>
            {title}
          </h2>
        </div>

        {showIntro && (
          <div className="max-w-sm lg:text-right">
            <p className="text-black text-sm leading-relaxed">
              The same trade-quality materials we install, ready for you to pick up or have delivered across
              Perth.
            </p>
            <Link
              to="/shop"
              className="group mt-4 inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
            >
              See the full range
              <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={showPrev}
          disabled={start === 0}
          aria-label={`Previous ${title} products`}
          className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowIcon className="rotate-[225deg]" />
        </button>
        <button
          type="button"
          onClick={showNext}
          disabled={start === maxStart}
          aria-label={`Next ${title} products`}
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
            <div key={slideIndex} className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full shrink-0 pr-5">
              {slide.map((product) => (
                <div key={product.title}>
                  <div className="aspect-square bg-gray-100 rounded-lg" />
                  <p className="mt-3 text-sm text-black leading-snug line-clamp-2">{product.title}</p>
                  <p className="mt-1 text-sm text-black">{product.price}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopPreview() {
  return (
    <section className="bg-white py-16 sm:py-24 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        <ProductRow title="Popular right now" products={POPULAR_PRODUCTS} showIntro />
        <ProductRow title="Affordable picks" products={AFFORDABLE_PRODUCTS} />
      </div>
    </section>
  );
}

export default ShopPreview;
