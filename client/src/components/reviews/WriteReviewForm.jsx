import { useState } from "react";
import { Link } from "react-router-dom";
import StarIcon from "../StarIcon";
import ArrowIcon from "../ArrowIcon";
import { submitReview } from "../../lib/api";
import { fileToDataUrl } from "../../lib/files";
import { useAuth } from "../../context/AuthContext";

const MAX_REVIEW_PHOTOS = 5;

function WriteReviewForm({ slug, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_REVIEW_PHOTOS - photos.length);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setPhotos((prev) => [...prev, ...dataUrls].slice(0, MAX_REVIEW_PHOTOS));
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !comment) return;
    setError("");
    setSubmitting(true);
    try {
      const newReview = await submitReview(slug, {
        name: user.name || user.email,
        rating,
        comment,
        photos,
      });
      onReviewAdded(newReview);
      setComment("");
      setPhotos([]);
      setRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="font-semibold text-black">Write a review</p>
        {user && (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 shrink-0 rounded-full bg-gray-700 text-white text-xs font-semibold flex items-center justify-center">
              {(user.name || user.email)[0].toUpperCase()}
            </span>
            <p className="text-xs text-gray-500">
              Posting as <span className="font-medium text-black">{user.name || user.email}</span>
              {user.googleId ? " · via Google account" : " · via email account"}
            </p>
          </div>
        )}
      </div>

      {!user ? (
        <p className="mt-4 text-sm text-gray-500">
          <Link to="/my-account" className="text-black font-medium underline">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <p className="text-sm font-medium text-black">Your rating</p>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
                className="text-black"
              >
                <StarIcon filled={n <= rating} className="w-5 h-5" />
              </button>
            ))}
          </div>

          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others how it held up — quality, delivery, install…"
            rows={3}
            className="mt-4 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-black"
          />

          <p className="mt-4 text-sm font-medium text-black">Add photos</p>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            {photos.length < MAX_REVIEW_PHOTOS && (
              <label className="w-16 h-16 shrink-0 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-xl text-gray-400 cursor-pointer hover:border-gray-400">
                +
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
            )}
            {photos.map((src, i) => (
              <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white text-[10px] flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
            <span className="text-xs text-gray-400">Up to {MAX_REVIEW_PHOTOS} photos · JPG or PNG</span>
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

          <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-400">By posting you agree to our review guidelines.</p>
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Review"}
              <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default WriteReviewForm;
