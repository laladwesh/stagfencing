import { useState } from "react";
import { Link } from "react-router-dom";

function ProjectModal({ project, onClose, hideActionLinks = false }) {
  const images = project.images?.length ? project.images : [project.image];
  const [activeImage, setActiveImage] = useState(0);
  const completed = project.completedDate
    ? new Date(project.completedDate).toLocaleDateString("en-AU", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-sm max-w-3xl w-full overflow-hidden grid grid-cols-1 sm:grid-cols-2 max-h-[90vh] overflow-y-auto sm:h-[560px] sm:max-h-[560px] sm:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:h-full">
          <div className="h-56 sm:h-auto sm:flex-1 sm:min-h-0">
            <img src={images[activeImage]} alt={project.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="shrink-0 flex items-center gap-1.5 p-2 overflow-x-auto border-t border-gray-100">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={
                    "w-14 h-14 shrink-0 rounded overflow-hidden border-2 transition-colors " +
                    (i === activeImage ? "border-black" : "border-transparent")
                  }
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 relative sm:overflow-y-auto">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors"
          >
            ✕
          </button>

          <span className="inline-block bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-full">
            {project.service}
          </span>
          <h3 className="mt-3 text-xl font-semibold text-black">{project.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{project.suburb}, WA</p>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Location</dt>
              <dd className="text-black font-medium">{project.suburb}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Service</dt>
              <dd className="text-black font-medium">{project.service}</dd>
            </div>
            {project.length && (
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <dt className="text-gray-500">Length</dt>
                <dd className="text-black font-medium">{project.length}</dd>
              </div>
            )}
            {project.colour && (
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <dt className="text-gray-500">Colour</dt>
                <dd className="text-black font-medium">{project.colour}</dd>
              </div>
            )}
            {completed && (
              <div className="flex justify-between pb-2">
                <dt className="text-gray-500">Completed</dt>
                <dd className="text-black font-medium">{completed}</dd>
              </div>
            )}
          </dl>

          {!hideActionLinks && project.serviceSlug && (
            <Link
              to={
                project.categorySlug && project.categorySlug !== project.serviceSlug
                  ? `/services/${project.categorySlug}/${project.serviceSlug}`
                  : `/services/${project.serviceSlug}`
              }
              className="mt-3 block text-center border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-2.5 rounded-full transition-colors"
            >
              View this service
            </Link>
          )}
          {!hideActionLinks && project.productSlug && (
            <Link
              to={`/product/${project.productSlug}`}
              className="mt-3 block text-center border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-2.5 rounded-full transition-colors"
            >
              Shop this product
            </Link>
          )}
          <Link
            to="/request-a-quote"
            className="mt-3 block text-center bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors"
          >
            Get A Similar Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
