import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminButton } from "../../components/admin/AdminFormFields";
import { getAdminServices, deleteService } from "../../lib/adminApi";

function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminServices()
      .then((data) => setServices(data.services))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete service "${service.name}"?`)) return;
    try {
      await deleteService(service._id);
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">Services</h1>
          <p className="mt-1 text-sm text-gray-500">{services.length} service(s).</p>
        </div>
        <Link to="/admin/services/services/new">
          <AdminButton type="button">+ Add service</AdminButton>
        </Link>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">From price</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3 text-black">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.fromPrice ? `$${s.fromPrice} ${s.priceUnit || ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      to={`/admin/services/services/${s._id}/edit`}
                      className="text-xs font-medium text-black underline underline-offset-2"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="text-xs font-medium text-red-600 underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminServicesPage;
