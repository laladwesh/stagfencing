import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getAllServicesAdmin, uploadFile, updateStyleIcon } from "../lib/api";

function StyleIconRow({ serviceSlug, style, onUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      const { service } = await updateStyleIcon(serviceSlug, style._id, url);
      onUpdated(service);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-3">
      <div className="w-16 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
        {style.icon ? (
          <img src={style.icon} alt="" className="max-h-8 max-w-full object-contain" />
        ) : (
          <span className="text-[10px] text-gray-400">none</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black truncate">{style.name}</p>
        <p className="text-xs text-gray-400">
          {style.fromPrice ? `$${style.fromPrice} ${style.priceUnit}` : style.priceUnit}
        </p>
      </div>
      <label className="text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-full px-3 py-1.5 cursor-pointer shrink-0 transition-colors">
        {uploading ? "Uploading…" : "Upload icon"}
        <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <p className="text-xs text-red-600 shrink-0">{error}</p>}
    </div>
  );
}

function AdminServiceIconsPage() {
  const { user, loading } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    getAllServicesAdmin()
      .then((data) => {
        setServices(data.services);
        if (data.services.length) setSelectedSlug(data.services[0].slug);
      })
      .finally(() => setFetching(false));
  }, [user]);

  const handleServiceUpdated = (updatedService) => {
    setServices((prev) => prev.map((s) => (s.slug === updatedService.slug ? updatedService : s)));
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-black">Sign in required</h1>
          <p className="mt-2 text-sm text-gray-500">This tool needs a signed-in account.</p>
          <Link to="/my-account" className="mt-4 inline-block text-sm font-medium text-brand-orange">
            Sign in
          </Link>
        </div>
      </Layout>
    );
  }

  const selectedService = services.find((s) => s.slug === selectedSlug);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-semibold text-black">Service icon manager</h1>
        <p className="mt-1 text-sm text-gray-500">
          Temporary internal tool — upload a per-style icon (SVG/PNG). Cards fall back to an auto-generated
          bar chart if no icon is set. No admin-role restriction yet, so this is only reachable if you know
          the URL.
        </p>

        {fetching ? (
          <p className="mt-8 text-sm text-gray-500">Loading services…</p>
        ) : (
          <>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="mt-6 bg-[#F3EFE9] rounded-md px-4 py-2.5 text-sm focus:outline-none"
            >
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.category?.name ? `${s.category.name} / ` : ""}
                  {s.name}
                </option>
              ))}
            </select>

            {selectedService && (
              <div className="mt-6 border border-gray-200 rounded-xl px-5">
                {selectedService.styles.length === 0 && (
                  <p className="py-6 text-sm text-gray-500">This service has no styles configured.</p>
                )}
                {selectedService.styles.map((style) => (
                  <StyleIconRow
                    key={style._id}
                    serviceSlug={selectedService.slug}
                    style={style}
                    onUpdated={handleServiceUpdated}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default AdminServiceIconsPage;
