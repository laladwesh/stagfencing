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

function AboutUs() {
  return (
    <section className="bg-[#F3EFE9] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              ABOUT US
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold text-black leading-tight">
              The Perth fencing team that does the hard jobs too
            </h2>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-black leading-snug">
              Fencing for Perth homes and businesses, done properly and without the run-around
            </h3>
            <p className="mt-3 text-sm sm:text-base text-black leading-relaxed">
              We quote most jobs the same day you call, use materials made for the WA climate, and clean up
              before we leave. From a back fence to a full commercial run, you get one crew, one clear price,
              and a fence built to last.
            </p>
            <Link
              to="/about-us"
              className="group mt-5 inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
            >
              More About Us
              <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl overflow-hidden">
          <img src="/hero-bg.png" alt="Fence installation" className="w-full h-64 sm:h-[420px] object-cover" />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
