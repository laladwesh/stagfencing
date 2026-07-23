import { useState } from "react";
import { FaStar } from "react-icons/fa";

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

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const REVIEWS = [
  {
    name: "Blake West",
    rating: "5.0",
    avatarLetter: "B",
    avatarColor: "bg-blue-600",
    text: "Couldn't recommend Adi and the team at Stag Fencing enough. They did a fantastic job at removing our old asbestos fence and worked their",
  },
  {
    name: "Michael W",
    rating: "4.9",
    avatarLetter: "M",
    avatarColor: "bg-green-600",
    text: "Excellent service removing an asbestos fencing, no breakage and very professional. Quoted on the work the same day as requested and complete",
  },
  {
    name: "Manpreet Singh",
    rating: "5.0",
    avatarLetter: "M",
    avatarColor: "bg-orange-600",
    text: "Stag Fencing provides excellent service with high-quality materials and skilled craftsmanship. Their team is professional, reliable, and efficient. Hi",
  },
  {
    name: "Sandra Schmid",
    rating: "5.0",
    avatarLetter: "S",
    avatarColor: "bg-green-600",
    text: "From the first call to the final clean-up the whole job was handled without a single hiccup. Would happily use them again for the next property",
  },
  {
    name: "Priya Nair",
    rating: "5.0",
    avatarLetter: "P",
    avatarColor: "bg-purple-600",
    text: "Got three quotes and Stag's was the clearest by far. No hidden extras, showed up when they said they would and left the yard spotless",
  },
  {
    name: "Tom Baxter",
    rating: "4.8",
    avatarLetter: "T",
    avatarColor: "bg-red-600",
    text: "Retaining wall and Colorbond fence done together in one week. Council approvals sorted for us too, which saved a lot of back and forth",
  },
  {
    name: "Grace Lin",
    rating: "5.0",
    avatarLetter: "G",
    avatarColor: "bg-teal-600",
    text: "Pool fencing done to code without making the yard feel closed in. Frameless glass looks fantastic and the install crew were tidy and quick",
  },
  {
    name: "Daniel Okafor",
    rating: "4.9",
    avatarLetter: "D",
    avatarColor: "bg-indigo-600",
    text: "Old asbestos fence removed and replaced with slat fencing in the same visit. Handled the disposal paperwork so we didn't have to think about it",
  },
];

const VISIBLE_COUNT = 4;
const MAX_START = REVIEWS.length - VISIBLE_COUNT;
const SLIDES = Array.from({ length: MAX_START + 1 }, (_, s) => REVIEWS.slice(s, s + VISIBLE_COUNT));

function Reviews() {
  const [start, setStart] = useState(0);

  const showPrev = () => setStart((s) => Math.max(0, s - 1));
  const showNext = () => setStart((s) => Math.min(MAX_START, s + 1));

  return (
    <section className="bg-brand-dark py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              REVIEWS
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold text-white leading-tight">
              What our customers
              <br />
              actually say
            </h2>
          </div>

          <div className="max-w-sm lg:text-right">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Perth homeowners and businesses, in their own words. Most mention the same things: quick quotes,
              a tidy job, and no fuss.
            </p>
            <div className="mt-4 flex gap-2 lg:justify-end">
              <button
                type="button"
                onClick={showPrev}
                disabled={start === 0}
                aria-label="Previous review"
                className="w-9 h-9 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowIcon className="rotate-[225deg]" />
              </button>
              <button
                type="button"
                onClick={showNext}
                disabled={start === MAX_START}
                aria-label="Next review"
                className="w-9 h-9 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowIcon className="rotate-45" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${start * 100}%)` }}
          >
            {SLIDES.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full shrink-0 pr-5"
              >
                {slide.map((review) => (
                  <div key={review.name} className="bg-white rounded-xl overflow-hidden">
                    <img src="/hero-bg.png" alt="" className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center gap-1.5">
                        <GoogleIcon />
                        <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 leading-snug">
                        {review.text}
                        {"… "}
                        <span className="text-gray-400 underline cursor-pointer">read more</span>
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span
                          className={
                            "w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center shrink-0 " +
                            review.avatarColor
                          }
                        >
                          {review.avatarLetter}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-500">Home owner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
