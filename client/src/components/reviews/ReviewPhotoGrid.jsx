function ReviewPhotoGrid({ photos, max = 6 }) {
  if (!photos.length) return null;
  const visible = photos.slice(0, max);
  const remaining = photos.length - max;

  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-black">Photos from customers</p>
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-3">
        {visible.map((src, i) => {
          const isLast = i === visible.length - 1 && remaining > 0;
          return (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={src} alt="" className="w-full h-full object-cover" />
              {isLast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                  +{remaining}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewPhotoGrid;
