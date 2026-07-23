import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ServiceDetailTemplate from "../components/services/ServiceDetailTemplate";
import { getServiceDetail } from "../lib/api";

function ServiceDetailPage() {
  const { serviceSlug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getServiceDetail(serviceSlug)
      .then((data) => {
        setService(data.service);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [serviceSlug]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
      </Layout>
    );
  }

  if (notFound || !service) {
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

  const categoryName = (service.category?.name || "").replace(/ Range$/, "");
  const breadcrumb = `Home / Services / ${categoryName} / ${service.name}`;

  return (
    <Layout transparentHeader>
      <ServiceDetailTemplate service={service} breadcrumb={breadcrumb} />
    </Layout>
  );
}

export default ServiceDetailPage;
