import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import Layout from "../components/Layout";
import ArrowIcon from "../components/ArrowIcon";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewPhotoGrid from "../components/reviews/ReviewPhotoGrid";
import WriteReviewForm from "../components/reviews/WriteReviewForm";
import Seo from "../components/Seo";
import { getCategory, getProduct } from "../lib/api";
import { useCart } from "../context/CartContext";
import { notifyAddedToCart } from "../lib/toast";
import { productJsonLd } from "../lib/seo";

const REVIEWS_PREVIEW_COUNT = 3;

function defaultSelections(variantGroups) {
  const selections = {};
  for (const group of variantGroups) {
    const defaultOption = group.options.find((o) => o.isDefault) || group.options[0];
    if (defaultOption) selections[group.name] = defaultOption.label;
  }
  return selections;
}

function ProductCard({ product }) {
  const range = product.priceRange;
  return (
    <Link to={`/product/${product.slug}`} className="block">
      <div className="rounded-xl overflow-hidden bg-gray-100">
        <img src={product.images?.[0]} alt={product.name} className="w-full h-40 object-cover" />
      </div>
      <p className="mt-2 text-xs text-gray-500">{product.shortDescription}</p>
      <p className="mt-1 text-sm font-semibold text-black leading-snug">{product.name}</p>
      <p className="mt-1 text-sm text-gray-700">
        {range.min === range.max ? `$${range.min.toFixed(2)}` : `$${range.min.toFixed(2)} - $${range.max.toFixed(2)}`}
      </p>
    </Link>
  );
}

function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [categoryPath, setCategoryPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selections, setSelections] = useState({});
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getProduct(slug)
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setRelated(data.related);
        setSelections(defaultSelections(data.product.variantGroups || []));
        setActiveImage(0);
        setQuantity(1);
        setLoading(false);
        return getCategory(data.product.category.slug).catch(() => null);
      })
      .then((catData) => setCategoryPath(catData))
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  const price = useMemo(() => {
    if (!product) return { min: 0, max: 0 };
    let total = product.basePrice;
    for (const group of product.variantGroups || []) {
      const selectedLabel = selections[group.name];
      const option = group.options.find((o) => o.label === selectedLabel);
      if (option) total += option.priceModifier || 0;
    }
    return total;
  }, [product, selections]);

  const subCategoryName = useMemo(() => {
    if (!categoryPath || !product?.subCategorySlug) return null;
    const sub = (categoryPath.subCategories || []).find((s) => s.slug === product.subCategorySlug);
    return sub?.name || null;
  }, [categoryPath, product]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const reviewPhotoGallery = useMemo(() => reviews.flatMap((r) => r.photos || []), [reviews]);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      image: product.images?.[0],
      selections,
      quantity,
      unitPrice: price,
    });
    notifyAddedToCart({ name: product.name, image: product.images?.[0] });
  };

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
        title={product.name}
        description={product.shortDescription || product.description}
        path={`/product/${slug}`}
        image={product.images?.[0]}
        jsonLd={productJsonLd({
          name: product.name,
          description: product.shortDescription || product.description,
          path: `/product/${slug}`,
          image: product.images?.[0],
          price: price.toFixed(2),
          sku: product.sku,
          ratingValue: averageRating,
          reviewCount: reviews.length,
          reviews: reviews.slice(0, 10).map((r) => ({ author: r.name, rating: r.rating, body: r.comment })),
        })}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-400">
          Home / Shop
          {categoryPath && ` / ${categoryPath.name}`}
          {subCategoryName && ` / ${subCategoryName}`}
          {` / ${product.name}`}
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.images?.[activeImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={
                      "rounded-lg overflow-hidden border-2 " +
                      (i === activeImage ? "border-black" : "border-transparent")
                    }
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500">{product.shortDescription}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-black">{product.name}</h1>
            {product.sku && <p className="mt-2 text-xs text-gray-400">SKU: {product.sku}</p>}
            <p className="mt-2 text-xl font-semibold text-black">${price.toFixed(2)}</p>

            <div className="mt-5 space-y-5">
              {(product.variantGroups || []).map((group) => (
                <div key={group.name}>
                  <p className="text-sm font-medium text-black">
                    {group.name} — <span className="text-gray-500">{selections[group.name]}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isSelected = selections[group.name] === option.label;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          disabled={option.inStock === false}
                          onClick={() => setSelections((prev) => ({ ...prev, [group.name]: option.label }))}
                          className={
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors " +
                            (option.inStock === false
                              ? "opacity-40 cursor-not-allowed border-transparent text-gray-400"
                              : isSelected
                              ? "border-black text-black"
                              : "border-transparent text-gray-600 hover:border-gray-300")
                          }
                        >
                          {option.swatch && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: option.swatch }}
                            />
                          )}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <p className="text-sm font-medium text-black">Quantity</p>
              <div className="flex items-center gap-3 bg-[#F3EFE9] rounded-full px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-black font-semibold"
                >
                  -
                </button>
                <span className="text-sm text-black w-4 text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="text-black font-semibold">
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
              >
                Add To Cart
                <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                  <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </button>
              <Link
                to="/request-a-quote"
                className="group inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
              >
                Get A Free Quote
                <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </Link>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {product.inStock === false ? "Out of stock" : "In stock"} · Ships from Balcatta WA · Free Click &
              Collect
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-black">Description</h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{product.description}</p>

            {product.whatsIncluded?.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-black">What's included</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                  {product.whatsIncluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {product.specifications?.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-black">Specifications</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-3">
                      <dt className="text-gray-500">{spec.label}</dt>
                      <dd className="text-black font-medium text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm border-t border-b border-gray-200 py-6">
          <div>
            <p className="font-semibold text-black">Delivery</p>
            <p className="mt-1 text-gray-500">Perth metro, 2-4 business days</p>
          </div>
          <div>
            <p className="font-semibold text-black">Click &amp; Collect</p>
            <p className="mt-1 text-gray-500">Free from Balcatta warehouse</p>
          </div>
          <div>
            <p className="font-semibold text-black">Returns</p>
            <p className="mt-1 text-gray-500">30 days on unopened items</p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-black">Customer reviews</h2>
            {averageRating && (
              <div className="flex items-center gap-2">
                <StarRating value={averageRating} />
                <span className="text-sm font-semibold text-black">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">· {reviews.length} reviews</span>
              </div>
            )}
          </div>

          <ReviewPhotoGrid photos={reviewPhotoGallery} />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
            {reviews.slice(0, REVIEWS_PREVIEW_COUNT).map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>

          {reviews.length > REVIEWS_PREVIEW_COUNT && (
            <Link
              to={`/product/${slug}/reviews`}
              className="mt-6 inline-block text-sm font-medium text-black underline underline-offset-2"
            >
              View all {reviews.length} reviews
            </Link>
          )}

          <div className="mt-8">
            <WriteReviewForm slug={slug} onReviewAdded={(newReview) => setReviews((prev) => [newReview, ...prev])} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-semibold text-black">You might also need</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ProductDetailPage;
