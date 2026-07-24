import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getSearchQueries, deleteSearchQuery } from "../../lib/adminApi";

function AdminSearchAnalyticsPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSearchQueries()
      .then((data) => setQueries(data.queries))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (query) => {
    try {
      await deleteSearchQuery(query._id);
      setQueries((prev) => prev.filter((q) => q._id !== query._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">Search analytics</h1>
      <p className="mt-1 text-sm text-gray-500">
        What customers type into the search box. The top terms here feed the "Popular searches" suggestions.
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Query</th>
                <th className="px-4 py-3 font-medium">Times searched</th>
                <th className="px-4 py-3 font-medium">Last searched</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queries.map((q) => (
                <tr key={q._id}>
                  <td className="px-4 py-3 text-black">{q.query}</td>
                  <td className="px-4 py-3 text-gray-600">{q.count}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(q.lastSearchedAt).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(q)}
                      className="text-xs font-medium text-red-600 underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {queries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No searches logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminSearchAnalyticsPage;
