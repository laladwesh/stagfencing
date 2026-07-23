import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ArrowIcon from "../components/ArrowIcon";
import { FILTERS, GALLERY_PROJECTS } from "../data/galleryProjects";

function QuoteCta({ label }) {
  return (
    <Link
      to="/request-a-quote"
      className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
    >
      {label}
      <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
        <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </Link>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden grid grid-cols-1 sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <img src={project.image} alt={project.title} className="w-full h-56 sm:h-full object-cover" />
          <div className="grid grid-cols-3 gap-1 p-1 bg-white sm:hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <img key={i} src={project.image} alt="" className="w-full h-14 object-cover rounded" />
            ))}
          </div>
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
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Length</dt>
              <dd className="text-black font-medium">{project.length}</dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-gray-500">Completed</dt>
              <dd className="text-black font-medium">{project.completed}</dd>
            </div>
          </dl>

          <Link
            to="/request-a-quote"
            className="mt-6 block text-center bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors"
          >
            Get A Similar Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const projects =
    activeFilter === "All"
      ? GALLERY_PROJECTS
      : GALLERY_PROJECTS.filter((p) => p.service === activeFilter);

  return (
    <Layout>
      <div className="bg-white text-center pt-14 pb-8">
        <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-black">
          Gallery
        </span>
        <div className="mt-4 flex items-center justify-center gap-3">
          <QuoteCta label="Get A Free Quote" />
          <QuoteCta label="Get A Free Quote" />
        </div>
      </div>

      <div className="bg-white pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors " +
                  (activeFilter === filter
                    ? "bg-black text-white"
                    : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                }
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedProject(project)}
                className="text-left"
              >
                <div className="rounded-xl overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {project.suburb} · {project.service}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </Layout>
  );
}

export default GalleryPage;
