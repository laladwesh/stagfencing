import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import Layout from "../components/Layout";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewPhotoGrid from "../components/reviews/ReviewPhotoGrid";
import WriteReviewForm from "../components/reviews/WriteReviewForm";
import Seo from "../components/Seo";
import { getProduct } from "../lib/api";

function ProductReviewsPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getProduct(slug)
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const allPhotos = useMemo(() => reviews.flatMap((r) => r.photos || []), [reviews]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
      </Layout>
    );
  }

  if (notFound || !product) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-black">Product not found</h1>
          <Link to="/shop/colorbond-fencing" className="mt-4 inline-block text-sm font-medium text-brand-orange">
            ← Back to shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={`Reviews for ${product.name}`}
        description={`Read ${reviews.length} customer reviews for ${product.name}.`}
        path={`/product/${slug}/reviews`}
        image={product.images?.[0]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to={`/product/${slug}`} className="text-xs text-gray-400 hover:text-black">
          ← Back to {product.name}
        </Link>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-semibold text-black">Customer reviews</h1>
          {averageRating && (
            <div className="flex items-center gap-2">
              <StarRating value={averageRating} />
              <span className="text-sm font-semibold text-black">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">· {reviews.length} reviews</span>
            </div>
          )}
        </div>

        <ReviewPhotoGrid photos={allPhotos} max={12} />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>

        <div className="mt-10 max-w-2xl">
          <WriteReviewForm slug={slug} onReviewAdded={(newReview) => setReviews((prev) => [newReview, ...prev])} />
        </div>
      </div>
    </Layout>
  );
}

export default ProductReviewsPage;
