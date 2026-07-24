import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Shop categories", href: "/admin/shop/categories" },
  { label: "Shop products", href: "/admin/shop/products" },
  { label: "Shop reviews", href: "/admin/shop/reviews" },
  { label: "Service categories", href: "/admin/services/categories" },
  { label: "Services", href: "/admin/services/services" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Search analytics", href: "/admin/search-analytics" },
  { label: "Orders", href: "/admin/orders" },
];

function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-xl font-semibold text-black">Sign in required</h1>
          <p className="mt-2 text-sm text-gray-500">You need an account to access this.</p>
          <Link to="/my-account" className="mt-4 inline-block text-sm font-medium text-brand-orange">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-xl font-semibold text-black">Admin access required</h1>
          <p className="mt-2 text-sm text-gray-500">
            Signed in as {user.email}, but this account isn't an admin.
          </p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand-orange">
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <aside className="lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 p-5">
        <Link to="/" className="flex items-center gap-2">
          <img src="/stag-icon.svg" alt="Stag Fencing" className="h-8 w-auto" />
          <span className="font-semibold text-black">Admin</span>
        </Link>

        <nav className="mt-8 flex lg:flex-col flex-wrap gap-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={
                  "block px-3 py-2 rounded-lg transition-colors " +
                  (isActive ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-100")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="mt-8 block text-xs text-gray-400 hover:text-black">
          ← Back to site
        </Link>
      </aside>

      <main className="flex-1 p-5 sm:p-8 max-w-5xl">{children}</main>
    </div>
  );
}

export default AdminLayout;
