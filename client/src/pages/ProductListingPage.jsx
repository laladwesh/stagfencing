import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import PageBanner from "../components/PageBanner";
import ArrowIcon from "../components/ArrowIcon";
import Seo from "../components/Seo";
import { getCategories, getCategory, getProducts } from "../lib/api";

const PAGE_SIZE = 9;
const MAX_PRICE = 1200;

function QuoteCta() {
  return (
    <a
      href="/request-a-quote"
      className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
    >
      Get A Free Quote
      <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
        <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </a>
  );
}

function formatPrice(range) {
  if (!range) return "";
  return range.min === range.max
    ? `$${range.min.toFixed(2)}`
    : `$${range.min.toFixed(2)} - $${range.max.toFixed(2)}`;
}

function ProductListingPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const subCategory = searchParams.get("sub") || "";
  const sort = searchParams.get("sort") || "";
  const maxPrice = searchParams.get("max") || "";

  useEffect(() => {
    getCategories().then(setAllCategories).catch(() => setAllCategories([]));
  }, []);

  useEffect(() => {
    getCategory(categorySlug)
      .then(setCategory)
      .catch(() => setCategory(null));
  }, [categorySlug]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getProducts({ category: categorySlug, subCategory, search, maxPrice, sort, page, limit: PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setProducts(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [categorySlug, subCategory, search, maxPrice, sort, page]);

  const updateParam = (key, value, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (resetPage) next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Layout transparentHeader>
      <Seo
        title={category?.name ? `${category.name} | Shop` : "Shop"}
        description={category?.description || "DIY fencing supplies at trade prices, with Perth pickup or delivery."}
        path={`/shop/${categorySlug}`}
        image={category?.image}
      />
      <PageBanner
        breadcrumb="Home / Shop"
        title={category?.name || "Shop"}
        subtitle="DIY fencing supplies — trade prices, Perth pickup or delivery"
      >
        <QuoteCta />
        <QuoteCta />
      </PageBanner>

      <div className="bg-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500">
              {total === 0 ? "No results" : `Showing ${rangeStart}-${rangeEnd} of ${total} results`}
            </p>
            <input
              type="search"
              defaultValue={search}
              onChange={(e) => updateParam("search", e.target.value)}
              placeholder="Search"
              className="w-full sm:w-64 bg-[#F3EFE9] rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
            >
              <option value="">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-5">
                <p className="font-semibold text-black">Filter Products</p>

                <div className="mt-5">
                  <p className="text-sm font-medium text-black">Price</p>
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    value={maxPrice || MAX_PRICE}
                    onChange={(e) => updateParam("max", e.target.value)}
                    className="mt-2 w-full accent-black"
                  />
                  <p className="mt-1 text-xs text-gray-500">$0 - ${maxPrice || MAX_PRICE}</p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-black">Categories</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {allCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/shop/${cat.slug}`}
                        className={
                          "px-3 py-1.5 rounded-md text-xs font-medium transition-colors " +
                          (cat.slug === categorySlug
                            ? "bg-black text-white"
                            : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                        }
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {category?.subCategories?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-black">Sub Categories</p>
                    <div className="mt-2 flex flex-col gap-2">
                      {category.subCategories.map((sub) => (
                        <button
                          key={sub.slug}
                          type="button"
                          onClick={() => updateParam("sub", subCategory === sub.slug ? "" : sub.slug)}
                          className={
                            "text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors " +
                            (subCategory === sub.slug
                              ? "bg-black text-white"
                              : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                          }
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            <div className="lg:col-span-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading products…</p>
              ) : products.length === 0 ? (
                <p className="text-sm text-gray-500">No products match these filters.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product.slug}`}
                      className={"group block " + (product.inStock === false ? "opacity-50" : "")}
                    >
                      <div className="relative rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-full">
                            View
                          </span>
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">{product.shortDescription}</p>
                      <p className="mt-1 text-sm font-semibold text-black leading-snug">{product.name}</p>
                      <p className="mt-1 text-sm text-gray-700">{formatPrice(product.priceRange)}</p>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      className={
                        "w-9 h-9 rounded-full text-sm font-medium transition-colors " +
                        (p === page ? "bg-black text-white" : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                      }
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductListingPage;
