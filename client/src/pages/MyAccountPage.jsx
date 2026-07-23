import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { requestOtp, verifyOtp, loginWithGoogle, getOrders } from "../lib/api";

function formatSelections(selections) {
  if (!selections) return null;
  const entries = Object.values(selections);
  return entries.length ? entries.join(" · ") : null;
}

function LoginPanel() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      login(data.token, data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await requestOtp(email);
      setStep("code");
      setInfo("Code sent — check your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await verifyOtp(email, code);
      login(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-2xl p-6">
      <h1 className="text-xl font-semibold text-black">Sign in</h1>
      <p className="mt-1 text-sm text-gray-500">Track orders and manage your details.</p>

      <div className="mt-5 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in failed")}
        />
      </div>

      <div className="mt-5 flex items-center gap-3 text-xs text-gray-400">
        <span className="flex-1 border-t border-gray-200" />
        or continue with email
        <span className="flex-1 border-t border-gray-200" />
      </div>

      {step === "email" ? (
        <form onSubmit={sendCode} className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-[#F3EFE9] rounded-md px-4 py-2.5 text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-4 space-y-3">
          <p className="text-xs text-gray-500">
            Code sent to <span className="font-medium text-black">{email}</span>
          </p>
          <input
            type="text"
            required
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            className="w-full bg-[#F3EFE9] rounded-md px-4 py-2.5 text-sm tracking-widest focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Verify & sign in"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-xs text-gray-500 hover:text-black"
          >
            ← Use a different email
          </button>
        </form>
      )}

      {info && <p className="mt-3 text-xs text-green-700">{info}</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function AccountPanel() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          {user.avatar && !avatarFailed ? (
            <img
              src={user.avatar}
              alt=""
              onError={() => setAvatarFailed(true)}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold">
              {(user.name || user.email)[0].toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-semibold text-black">{user.name || user.email}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium text-gray-600 hover:text-black border border-gray-300 rounded-full px-4 py-2 transition-colors"
        >
          Log out
        </button>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-black">Order history</h2>

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No orders yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-semibold text-black">Order #{order.reference}</p>
                <span className="text-xs font-medium bg-[#F3EFE9] text-black px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="mt-3 divide-y divide-gray-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2">
                    <div>
                      <p className="text-sm text-black">{item.name}</p>
                      {formatSelections(item.selections) && (
                        <p className="text-xs text-gray-500">{formatSelections(item.selections)}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 shrink-0">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm font-semibold">
                <span className="text-black">Total</span>
                <span className="text-black">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MyAccountPage() {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading…</p>
        ) : user ? (
          <AccountPanel />
        ) : (
          <LoginPanel />
        )}
      </div>
    </Layout>
  );
}

export default MyAccountPage;
