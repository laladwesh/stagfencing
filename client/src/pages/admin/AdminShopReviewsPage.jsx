import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StarRating from "../../components/StarRating";
import { getShopReviews, deleteShopReview } from "../../lib/adminApi";

function AdminShopReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getShopReviews()
      .then((data) => setReviews(data.reviews))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete review by "${review.name}"?`)) return;
    try {
      await deleteShopReview(review._id);
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">Shop reviews</h1>
      <p className="mt-1 text-sm text-gray-500">{reviews.length} review(s).</p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <StarRating value={review.rating} size="w-3 h-3" />
                  <p className="mt-1 text-sm text-gray-700 italic">&quot;{review.comment}&quot;</p>
                  <p className="mt-2 text-xs text-gray-500">
                    <span className="font-medium text-black">{review.name}</span>
                    {review.location && <> · {review.location}</>}
                    {review.product?.name && <> · on {review.product.name}</>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(review)}
                  className="text-xs font-medium text-red-600 underline underline-offset-2 shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminShopReviewsPage;
