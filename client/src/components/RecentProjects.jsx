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

const PROJECTS = [
  { location: "Byford, WA", image: "/hero-bg.png" },
  { location: "Baldivis, WA", image: "/hero-bg.png" },
  { location: "Mandurah, WA", image: "/hero-bg.png" },
  { location: "Ellenbrook, WA", image: "/hero-bg.png" },
  { location: "Armadale, WA", image: "/hero-bg.png" },
];

function RecentProjects() {
  const [active, setActive] = useState(0);

  const showPrev = () => setActive((i) => Math.max(0, i - 1));
  const showNext = () => setActive((i) => Math.min(PROJECTS.length - 1, i + 1));

  return (
    <section className="bg-white py-16 sm:py-24 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              RECENT PROJECTS
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
              Fences we've put up
              <br />
              around Perth
            </h2>
          </div>

          <div className="max-w-sm lg:text-right">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Real jobs across Perth homes and businesses. Have a look before you get a quote. Chances are
              we've done one near you.
            </p>
            <div className="mt-4 flex gap-2 lg:justify-end">
              <button
                type="button"
                onClick={showPrev}
                disabled={active === 0}
                aria-label="Previous project"
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowIcon className="rotate-[225deg]" />
              </button>
              <button
                type="button"
                onClick={showNext}
                disabled={active === PROJECTS.length - 1}
                aria-label="Next project"
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowIcon className="rotate-45" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 relative rounded-2xl overflow-hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {PROJECTS.map((project) => (
                <img
                  key={project.location}
                  src={project.image}
                  alt={project.location}
                  className="w-full shrink-0 h-64 sm:h-96 object-cover"
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2">
            {PROJECTS.map((project, i) => (
              <button
                key={project.location}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${project.location} project`}
                className={
                  "h-1.5 rounded-full bg-white transition-all " +
                  (i === active ? "w-8 opacity-100" : "w-1.5 opacity-50 hover:opacity-75")
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecentProjects;
