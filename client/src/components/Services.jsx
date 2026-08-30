import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServiceCategories } from "../lib/api";
import LazyImage from "./LazyImage";

// Hardcoded so the home page always shows these exact photos regardless of what's in the DB.
// Uploaded by server/update-home-service-images.js — same URLs recorded in server/home-service-image-urls.json.
const CATEGORY_IMAGES = {
  "colorbond-fencing": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014155458-0c6d28435ba8a443.png",
  "aluminium-slat-fencing-perth": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014156976-8a4226783d6efe08.png",
  "pool-fencing": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014157388-3085c6c9fcaf5722.png",
  "retaining-walls": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014157791-1df878069ebd7497.png",
  "gates-automation": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014158015-8922fb4faf2bf5cf.png",
  "security-fencing": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014158247-5d7f410dd983e111.png",
  "blade-fencing": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014158478-fadd60c382256a53.png",
  "asbestos-fence-removal": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014158703-715b271101e641ea.png",
  "pvc-fencing": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014158933-2a3d8659f2cd937a.png",
  "modular-walls": "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/home-services/1788014159163-f7b3e5ce6ef0b5c3.png",
};

function ServiceCard({ category, eager }) {
  return (
    <Link to={`/services/${category.slug}`} className="block group">
      <div className="rounded-sm overflow-hidden bg-gray-100 aspect-square">
        <LazyImage
          src={CATEGORY_IMAGES[category.slug] || category.image}
          alt={category.name}
          eager={eager}
          width={400}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-black">{category.name}</p>
      <p className="mt-0.5 text-xs text-gray-500">
        {category.fromPrice ? `from $${category.fromPrice} / ${category.priceUnit?.replace("per ", "")}` : ""}
      </p>
    </Link>
  );
}

function Services() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getServiceCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-start">
          <div>
            <span className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              OUR SERVICES
            </span>
            <h2 className="mt-4 lg:mt-5 text-4xl sm:text-5xl font-semibold text-gray-900">More than fences.</h2>
          </div>
          <p className="text-black leading-relaxed lg:pt-3">
            Whether you're after privacy, security, or a boundary that lifts the whole property, we build
            fences that do the job and last. New installs, repairs, and everything in between.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-10">
          {categories.map((category, i) => (
            <ServiceCard key={category.slug} category={category} eager={i < 4} />
          ))}

          <div className="col-span-2 bg-[#F3EFE9] rounded-sm p-6 flex flex-col justify-center">
            <p className="text-lg font-semibold text-black">Not sure which fence you need?</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Free on-site measure and a fixed written quote, usually within a couple of days. We'll walk the
              boundary with you and price the options.
            </p>
            <Link
              to="/request-a-quote"
              className="mt-5 inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors self-start"
            >
              Book A Free Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
