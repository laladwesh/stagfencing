import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CircleArrowIcon from "../CircleArrowIcon";
import LazyImage from "../LazyImage";

function InfoCell({ label, value }) {
  if (!value) return null;
  return (
    <div className="border-r border-b border-gray-200 px-3 py-2.5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-black">{value}</p>
    </div>
  );
}

const NO_SCROLLBAR_STYLE = { scrollbarWidth: "none", msOverflowStyle: "none" };

function ProjectModal({ project, onClose, hideActionLinks = false }) {
  const images = project.images?.length ? project.images : [project.image];
  const [activeImage, setActiveImage] = useState(0);
  const completed = project.completedDate ? new Date(project.completedDate).getFullYear() : null;
  const thumbRefs = useRef([]);

  useEffect(() => {
    thumbRefs.current[activeImage]?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeImage]);

  const goPrev = () => setActiveImage((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveImage((i) => (i + 1) % images.length);

  const infoRows = [
    ["Service", project.service],
    ["Suburb", project.suburb],
    ["Length", project.length],
    ["Colour", project.colour],
    ["Completed", completed],
  ].filter(([, value]) => value);

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white max-w-3xl w-full overflow-hidden grid grid-cols-1 sm:grid-cols-2 max-h-[90vh] overflow-y-auto sm:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="h-[300px] sm:h-[400px] w-full overflow-hidden">
            <LazyImage src={images[activeImage]} alt={project.title} eager width={800} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex items-center justify-end gap-2 pb-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="text-gray-600 hover:text-black transition-colors rotate-180"
                >
                  <CircleArrowIcon className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <CircleArrowIcon className="w-8 h-8" />
                </button>
              </div>
              <div
                className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={NO_SCROLLBAR_STYLE}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    ref={(el) => (thumbRefs.current[i] = el)}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={
                      "w-20 h-20 shrink-0 overflow-hidden border-2 transition-colors " +
                      (i === activeImage ? "border-black" : "border-transparent")
                    }
                  >
                    <LazyImage src={img} alt="" width={100} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors"
          >
            ✕
          </button>

          <p className="text-xs font-semibold tracking-wide text-brand-orange uppercase">{project.service}</p>
          <h3 className="mt-2 text-2xl font-semibold text-black leading-tight pr-8">{project.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {project.suburb}
            {completed ? ` · Completed ${completed}` : ""}
          </p>

          {infoRows.length > 0 && (
            <div className="mt-5 grid grid-cols-2 border-l border-t border-gray-200">
              {infoRows.map(([label, value]) => (
                <InfoCell key={label} label={label} value={value} />
              ))}
            </div>
          )}

          <div className="mt-5 space-y-2.5">
            {!hideActionLinks && project.serviceSlug && (
              <Link
                to={
                  project.categorySlug && project.categorySlug !== project.serviceSlug
                    ? `/services/${project.categorySlug}/${project.serviceSlug}`
                    : `/services/${project.serviceSlug}`
                }
                className="block text-center border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-2.5 rounded-full transition-colors"
              >
                View this service
              </Link>
            )}
            {!hideActionLinks && project.productSlug && (
              <Link
                to={`/product/${project.productSlug}`}
                className="block text-center border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-2.5 rounded-full transition-colors"
              >
                Shop this product
              </Link>
            )}
            <Link
              to="/request-a-quote"
              className="block text-center bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors"
            >
              Get A Similar Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
