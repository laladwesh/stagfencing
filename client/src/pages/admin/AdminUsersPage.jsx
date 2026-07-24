import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { getUsers, setUserAdmin } from "../../lib/adminApi";

function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleAdmin = async (u) => {
    setError("");
    try {
      const { user } = await setUserAdmin(u._id, !u.isAdmin);
      setUsers((prev) => prev.map((x) => (x._id === user._id ? user : x)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">Users</h1>
      <p className="mt-1 text-sm text-gray-500">{users.length} account(s).</p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Admin</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 text-black">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    {u.isAdmin ? (
                      <span className="text-xs font-semibold bg-black text-white rounded-full px-2.5 py-1">
                        Admin
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleAdmin(u)}
                      disabled={u._id === currentUser._id && u.isAdmin}
                      className="text-xs font-medium text-black underline underline-offset-2 disabled:opacity-40 disabled:no-underline"
                    >
                      {u.isAdmin ? "Remove admin" : "Make admin"}
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

export default AdminUsersPage;
