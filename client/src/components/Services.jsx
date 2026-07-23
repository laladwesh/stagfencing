import { useState } from "react";

function ArrowUpRightIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 1.875C10.5 1.77554 10.4605 1.68016 10.3902 1.60984C10.3198 1.53951 10.2244 1.5 10.125 1.5H5.62498C5.52553 1.5 5.43015 1.53951 5.35982 1.60984C5.28949 1.68016 5.24998 1.77554 5.24998 1.875C5.24998 1.97446 5.28949 2.06984 5.35982 2.14016C5.43015 2.21049 5.52553 2.25 5.62498 2.25H9.21973L1.60949 9.8595C1.57462 9.89437 1.54696 9.93576 1.52809 9.98131C1.50922 10.0269 1.49951 10.0757 1.49951 10.125C1.49951 10.1743 1.50922 10.2231 1.52809 10.2687C1.54696 10.3142 1.57462 10.3556 1.60949 10.3905C1.64435 10.4254 1.68574 10.453 1.7313 10.4719C1.77685 10.4908 1.82568 10.5005 1.87499 10.5005C1.92429 10.5005 1.97312 10.4908 2.01867 10.4719C2.06423 10.453 2.10562 10.4254 2.14049 10.3905L9.74998 2.78025V6.375C9.74998 6.47446 9.78949 6.56984 9.85982 6.64016C9.93015 6.71049 10.0255 6.75 10.125 6.75C10.2244 6.75 10.3198 6.71049 10.3902 6.64016C10.4605 6.56984 10.5 6.47446 10.5 6.375V1.875Z"
        fill="#0E0E0D"
      />
    </svg>
  );
}

const SERVICES = [
  { num: "01", title: "Colorbond Fencing", href: "/colorbond-fencing" },
  { num: "02", title: "Slat Fencing", href: "/aluminium-slat-fencing-perth" },
  {
    num: "03",
    title: "Pool Fencing",
    href: "/pool-fencing",
    description:
      "Frameless glass or tubular aluminium, built to meet WA pool safety laws. Keeps the kids safe without walling off the water.",
  },
  { num: "04", title: "Retaining Walls", href: "/retaining-walls" },
  { num: "05", title: "Gates & Automation", href: "/gates-automation" },
  { num: "06", title: "Security Fencing", href: "/security-fencing" },
  { num: "07", title: "Asbestos Fence Removal", href: "/asbestos-fence-removal" },
];

function Services() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <span className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            OUR SERVICES
          </span>

          <h2 className="mt-5 text-4xl sm:text-5xl font-semibold text-gray-900">More than fences.</h2>

          <ul className="mt-8 border-t border-gray-200">
            {SERVICES.map((service, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={service.num} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-md text-black">{service.num}</span>
                      <span className="text-3xl sm:text-3xl font-medium text-black">{service.title}</span>
                    </span>
                    <span className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-black shrink-0">
                      <ArrowUpRightIcon className={"transition-transform " + (isActive ? "rotate-45" : "")} />
                    </span>
                  </button>
                  {isActive && service.description && (
                    <p className="pb-4 pl-9 pr-12 text-sm text-gray-500 max-w-md">{service.description}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-black leading-relaxed">
            Whether you're after privacy, security, or a boundary that lifts the whole property, we build
            fences that do the job and last. New installs, repairs, and everything in between
          </p>
          <div className="mt-6 aspect-square rounded-md overflow-hidden">
            <img src="/hero-bg.png" alt="Fence installation" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
