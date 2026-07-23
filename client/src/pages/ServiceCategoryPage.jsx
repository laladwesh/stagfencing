import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PageBanner from "../components/PageBanner";
import ArrowIcon from "../components/ArrowIcon";
import ServiceDetailTemplate from "../components/services/ServiceDetailTemplate";
import { getServiceCategory, getServiceDetail } from "../lib/api";

function ServiceCard({ categorySlug, service }) {
  return (
    <Link to={`/services/${categorySlug}/${service.slug}`} className="block group">
      <div className="rounded-xl overflow-hidden bg-gray-100">
        <img
          src={service.cardImage}
          alt={service.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-black">{service.name}</p>
      <p className="mt-1 text-xs text-gray-500">
        {service.fromPrice ? `From $${service.fromPrice} ${service.priceUnit}` : service.priceUnit}
      </p>
      <p className="mt-1 text-xs font-medium text-black">View range →</p>
    </Link>
  );
}

function ServiceCategoryPage() {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [singleService, setSingleService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSingleService(null);
    getServiceCategory(categorySlug)
      .then((data) => {
        setCategory(data.category);
        setServices(data.services);
        if (!data.category.hasRange) {
          return getServiceDetail(categorySlug).then((detail) => setSingleService(detail.service));
        }
        return null;
      })
      .then(() => setLoading(false))
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [categorySlug]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
      </Layout>
    );
  }

  if (notFound || !category) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-black">Service not found</h1>
          <Link to="/services" className="mt-4 inline-block text-sm font-medium text-brand-orange">
            ← Back to services
          </Link>
        </div>
      </Layout>
    );
  }

  if (!category.hasRange) {
    if (!singleService) {
      return (
        <Layout>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
        </Layout>
      );
    }
    return (
      <Layout transparentHeader>
        <ServiceDetailTemplate service={singleService} breadcrumb={`Home / Services / ${category.name}`} />
      </Layout>
    );
  }

  return (
    <Layout transparentHeader>
      <PageBanner
        breadcrumb={`Home / Services / ${category.name.replace(/ Range$/, "")}`}
        title={category.rangeBannerTitle || category.name}
        subtitle={category.rangeBannerSubtitle}
      >
        <Link
          to="/request-a-quote"
          className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
        >
          {category.rangeBannerCta || "Get A Free Quote"}
          <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
            <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
      </PageBanner>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {category.rangeIntro && <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">{category.rangeIntro}</p>}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.slug} categorySlug={categorySlug} service={service} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ServiceCategoryPage;
