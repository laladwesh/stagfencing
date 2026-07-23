import StarRating from "../StarRating";

const AVATAR_COLORS = ["bg-stone-500", "bg-slate-600", "bg-emerald-700", "bg-orange-700", "bg-indigo-600", "bg-rose-700"];

function avatarColor(name) {
  const code = (name || "?").charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function ReviewCard({ review }) {
  return (
    <div>
      <StarRating value={review.rating} />
      <p className="mt-2 text-sm text-gray-700 italic">&quot;{review.comment}&quot;</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`w-7 h-7 shrink-0 rounded-full ${avatarColor(review.name)} text-white text-xs font-semibold flex items-center justify-center`}
        >
          {(review.name || "?")[0].toUpperCase()}
        </span>
        <p className="text-xs text-gray-500">
          <span className="font-medium text-black">{review.name}</span>
          {review.location && <> &middot; {review.location}</>}
        </p>
      </div>
      {review.photos?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.photos.map((src, i) => (
            <div key={i} className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
