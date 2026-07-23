import StarIcon from "./StarIcon";

function StarRating({ value, size = "w-3.5 h-3.5", className = "" }) {
  const rounded = Math.round(value);
  return (
    <div className={`flex text-black ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < rounded} className={size} />
      ))}
    </div>
  );
}

export default StarRating;
