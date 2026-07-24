import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminButton } from "../../components/admin/AdminFormFields";
import { getShopProducts, deleteShopProduct } from "../../lib/adminApi";

function AdminShopProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getShopProducts()
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await deleteShopProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">Shop products</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} product(s).</p>
        </div>
        <Link to="/admin/shop/products/new">
          <AdminButton type="button">+ Add product</AdminButton>
        </Link>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 text-black">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.priceMin === p.priceMax ? `$${p.priceMin?.toFixed(2)}` : `$${p.priceMin?.toFixed(2)} - $${p.priceMax?.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3">
                    {p.inStock ? (
                      <span className="text-xs text-green-700">In stock</span>
                    ) : (
                      <span className="text-xs text-red-600">Out of stock</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      to={`/admin/shop/products/${p._id}/edit`}
                      className="text-xs font-medium text-black underline underline-offset-2"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="text-xs font-medium text-red-600 underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminShopProductsPage;
