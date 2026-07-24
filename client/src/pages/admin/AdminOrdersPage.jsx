import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminOrders, setOrderStatus } from "../../lib/adminApi";

const STATUS_OPTIONS = ["Pending payment", "Paid", "Processing", "Shipped", "Completed", "Cancelled"];

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (order, status) => {
    setError("");
    try {
      const { order: updated } = await setOrderStatus(order._id, status);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">{orders.length} order(s).</p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-black">#{order.reference}</p>
                  <p className="text-xs text-gray-500">
                    {order.user?.name || order.user?.email || "—"} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value)}
                  className="bg-[#F3EFE9] rounded-full px-3 py-1.5 text-xs font-medium focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 divide-y divide-gray-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-gray-700">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="text-gray-500">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-between text-sm font-semibold border-t border-gray-100 pt-2">
                <span className="text-black">Total</span>
                <span className="text-black">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrdersPage;
