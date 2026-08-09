import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Select from "../../components/ui/Select";
import { getAdminQuotes, setQuoteStatus } from "../../lib/adminApi";

const STATUS_OPTIONS = ["new", "contacted", "quoted", "won", "lost"];

function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminQuotes()
      .then((data) => setQuotes(data.quotes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (quote, status) => {
    setError("");
    try {
      const { quote: updated } = await setQuoteStatus(quote._id, status);
      setQuotes((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">Quote requests</h1>
      <p className="mt-1 text-sm text-gray-500">{quotes.length} request(s).</p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {quotes.map((quote) => (
            <div key={quote._id} className="border border-gray-200 rounded-sm p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-black">
                    {quote.service} · #{quote.reference}
                  </p>
                  <p className="text-xs text-gray-500">
                    {quote.firstName} {quote.lastName} · {new Date(quote.createdAt).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <Select
                  value={quote.status}
                  onChange={(value) => handleStatusChange(quote, value)}
                  options={STATUS_OPTIONS}
                  className="w-36"
                  buttonClassName="bg-[#F3EFE9] rounded-full px-3 py-1.5 text-xs font-medium text-gray-800 capitalize"
                  align="right"
                />
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700">
                <p>
                  <span className="text-gray-400">Job: </span>
                  {[quote.propertyType, quote.approxLength, quote.timeframe].filter(Boolean).join(" · ")}
                </p>
                <p>
                  <span className="text-gray-400">Contact: </span>
                  <a href={`tel:${quote.mobile}`} className="hover:underline">{quote.mobile}</a> ·{" "}
                  <a href={`mailto:${quote.email}`} className="hover:underline">{quote.email}</a>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-gray-400">Address: </span>
                  {quote.siteAddress}, {quote.suburb} {quote.state} {quote.postcode}
                </p>
                {quote.preferredDate && (
                  <p className="sm:col-span-2">
                    <span className="text-gray-400">Measure: </span>
                    {new Date(quote.preferredDate).toLocaleDateString("en-AU", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    {quote.noPreference ? " · no preference" : ` · ${quote.preferredTime}`}
                  </p>
                )}
                {(quote.selection?.style || quote.selection?.color) && (
                  <p className="sm:col-span-2">
                    <span className="text-gray-400">Selection: </span>
                    {[quote.selection.style, quote.selection.color].filter(Boolean).join(" · ")}
                  </p>
                )}
                {quote.notes && (
                  <p className="sm:col-span-2">
                    <span className="text-gray-400">Notes: </span>
                    {quote.notes}
                  </p>
                )}
              </div>

              {quote.photos?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {quote.photos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt="" className="w-16 h-16 object-cover rounded-sm border border-gray-200" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {quotes.length === 0 && <p className="text-sm text-gray-500">No quote requests yet.</p>}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminQuotesPage;
