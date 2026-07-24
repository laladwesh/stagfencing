import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { getCategories } from "../lib/api";

function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Seo
        title="Shop Fencing Supplies Online"
        description="DIY fencing supplies at trade prices, with Perth pickup or delivery. Colorbond sheets, posts, gates and hardware."
        path="/shop"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold text-black">Shop</h1>
        <p className="mt-3 text-gray-600 max-w-xl">
          DIY fencing supplies at trade prices — Perth pickup or delivery.
        </p>

        {loading ? (
          <p className="mt-10 text-sm text-gray-500">Loading categories…</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/shop/${category.slug}`}
                className="block rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <div className="rounded-t-xl overflow-hidden bg-gray-100">
                  <img src={category.image} alt={category.name} className="w-full h-40 object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-black">{category.name}</h2>
                  {category.description && <p className="mt-1 text-sm text-gray-500">{category.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ShopPage;
