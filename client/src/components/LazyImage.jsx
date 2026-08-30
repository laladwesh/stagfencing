import { useEffect, useState } from "react";
import { getOptimizedUrl } from "../lib/imageOptimizer";

/**
 * Drop-in replacement for <img>. Same className/props API — no wrapper div,
 * so it never disturbs surrounding flex/grid layout.
 *
 * - Lazy-loads via the native `loading` attribute (skip for above-the-fold
 *   images by passing `eager`).
 * - Shows a skeleton by giving the <img> itself a plain background colour;
 *   the background disappears the instant the real pixels paint in, no
 *   separate overlay element needed.
 * - Routes every src through getOptimizedUrl so a future resizing/CDN layer
 *   only needs to change in one place.
 */
function LazyImage({ src, alt = "", width, eager = false, className = "", onLoad, onError, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Reset load state when the src itself changes (e.g. switching the active
  // photo in a gallery modal reuses this same component instance).
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const showSkeleton = !loaded && !errored;

  return (
    <img
      src={getOptimizedUrl(src, width)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={(e) => {
        setLoaded(true);
        onLoad && onLoad(e);
      }}
      onError={(e) => {
        setErrored(true);
        onError && onError(e);
      }}
      className={[className, showSkeleton ? "bg-gray-200" : ""].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export default LazyImage;
