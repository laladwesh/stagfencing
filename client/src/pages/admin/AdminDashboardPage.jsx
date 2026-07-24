import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getUsers, getShopProducts, getAdminServices, getAdminOrders } from "../../lib/adminApi";

const CARDS = [
  { key: "users", label: "Users", href: "/admin/users" },
  { key: "products", label: "Shop products", href: "/admin/shop/products" },
  { key: "services", label: "Services", href: "/admin/services/services" },
  { key: "orders", label: "Orders", href: "/admin/orders" },
];

function AdminDashboardPage() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all([getUsers(), getShopProducts(), getAdminServices(), getAdminOrders()])
      .then(([users, products, services, orders]) => {
        setCounts({
          users: users.users.length,
          products: products.products.length,
          services: services.services.length,
          orders: orders.orders.length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage everything on stagfencing.com.au from here.</p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            to={card.href}
            className="border border-gray-200 rounded-xl p-5 hover:border-black transition-colors"
          >
            <p className="text-2xl font-semibold text-black">{counts[card.key] ?? "—"}</p>
            <p className="mt-1 text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
