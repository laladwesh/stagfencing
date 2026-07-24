import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../components/Layout";
import PageBanner from "../components/PageBanner";
import ArrowIcon from "../components/ArrowIcon";
import Seo from "../components/Seo";
import { getServiceCategories } from "../lib/api";
import { SERVICES_FAQS } from "../data/servicesFaqs";
import { faqJsonLd } from "../lib/seo";

function ServiceCategoryCard({ category }) {
  return (
    <Link to={`/services/${category.slug}`} className="block group">
      <div className="rounded-xl overflow-hidden bg-gray-100">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-black">{category.name}</p>
      <p className="mt-1 text-xs text-gray-500">
        {category.fromPrice ? `from $${category.fromPrice} / ${category.priceUnit?.replace("per ", "")}` : ""}
      </p>
    </Link>
  );
}

function ServicesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    getServiceCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout transparentHeader>
      <Seo
        title="Fencing Services Perth | Installation & Repairs"
        description="Colorbond, pool, slat, security, retaining wall and gate installation across Perth. Free on-site measure and a written quote within 48 hours."
        path="/services"
        jsonLd={faqJsonLd(SERVICES_FAQS)}
      />
      <PageBanner
        breadcrumb="Home / Services"
        title="Installation services"
        subtitle="Every fence, wall and gate we build — pick your service"
      >
        <Link
          to="/calculators"
          className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
        >
          Fencing Calculator
          <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
            <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
        <a
          href="tel:0431703770"
          className="group inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
        >
          Call Now
          <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center">
            <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </a>
      </PageBanner>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <ServiceCategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-xl font-semibold text-black">Services FAQs</h2>
          <div className="mt-4 border-t border-gray-200">
            {SERVICES_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.question} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-black">{faq.question}</span>
                    <FaChevronDown
                      className={
                        "w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-300 " +
                        (isOpen ? "rotate-180" : "")
                      }
                    />
                  </button>
                  <div
                    className={
                      "grid transition-[grid-template-rows] duration-300 ease-in-out " +
                      (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                    }
                  >
                    <div className="overflow-hidden">
                      <p className="pb-4 text-sm text-gray-600 leading-relaxed max-w-2xl">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ServicesPage;
