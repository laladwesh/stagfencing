import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ArrowIcon from "../components/ArrowIcon";
import Seo from "../components/Seo";
import ProjectModal from "../components/gallery/ProjectModal";
import LazyImage from "../components/LazyImage";
import { getGalleryProjects } from "../lib/api";

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

function GalleryPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    getGalleryProjects()
      .then((data) => setProjects(data.projects))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filters = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.service).filter(Boolean))];
    return ["All", ...unique];
  }, [projects]);

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((p) => p.service === activeFilter);

  return (
    <Layout>
      <Seo
        title="Fencing Gallery | Completed Projects in Perth"
        description="Browse real Colorbond, pool, slat, security and retaining wall fencing projects completed across Perth by Stag Fencing."
        path="/gallery"
      />
      <div className="bg-white text-center pt-14 pb-8">
        <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-black">
          Gallery
        </span>
        <div className="mt-4 flex items-center justify-center gap-3">
          <QuoteCta label="Get A Free Quote" />
        </div>
      </div>

      <div className="bg-white pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading…</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {filters.map((filter) => (
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
                {filteredProjects.map((project, i) => (
                  <button
                    key={project._id}
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-left"
                  >
                    <div className="rounded-sm overflow-hidden">
                      <LazyImage
                        src={project.image}
                        alt={project.title}
                        eager={i < 6}
                        width={500}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {project.suburb} · {project.service}
                    </p>
                  </button>
                ))}
                {filteredProjects.length === 0 && (
                  <p className="text-sm text-gray-500">No projects in this category yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </Layout>
  );
}

export default GalleryPage;
