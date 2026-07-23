import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../lib/api";

const DELIVERY_METHODS = [
  { id: "pickup-balcatta", label: "Pick up - Balcatta", fee: 0 },
  { id: "pickup-bunbury", label: "Pick up - Bunbury", fee: 0 },
  { id: "delivery", label: "Delivery", fee: 15 },
];

function CheckoutPage() {
  const { user, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [deliveryMethodId, setDeliveryMethodId] = useState(DELIVERY_METHODS[0].id);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const deliveryMethod = DELIVERY_METHODS.find((m) => m.id === deliveryMethodId);
  const total = subtotal + deliveryMethod.fee;

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const order = await createOrder({
        items: items.map((item) => ({
          productSlug: item.slug,
          name: item.name,
          image: item.image,
          selections: item.selections,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        deliveryMethod: deliveryMethod.label,
        subtotal,
        discount: 0,
        deliveryFee: deliveryMethod.fee,
        total,
      });
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (confirmedOrder) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-black">Order placed</h1>
          <p className="mt-3 text-gray-600">
            Thanks — order <span className="font-semibold text-black">#{confirmedOrder.reference}</span> is
            in. We'll be in touch to confirm payment and delivery.
          </p>
          <Link
            to="/my-account"
            className="mt-6 inline-block bg-black hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            View order history
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-black">Sign in to check out</h1>
          <p className="mt-3 text-gray-600">Your cart is saved — sign in or create an account to continue.</p>
          <Link
            to="/my-account"
            className="mt-6 inline-block bg-black hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Sign in
          </Link>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-black">Your cart is empty</h1>
          <Link
            to="/shop/colorbond-fencing"
            className="mt-6 inline-block bg-black hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Browse the shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-semibold text-black">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">
          Payment is confirmed over the phone or by EFT after we've reviewed your order — no card details
          needed here yet.
        </p>

        <div className="mt-6 border border-gray-200 rounded-2xl divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-black">{item.name}</p>
                <p className="text-xs text-gray-500">Qty {item.quantity}</p>
              </div>
              <p className="text-sm text-gray-700 shrink-0">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-black">Delivery</p>
          <div className="mt-2 space-y-2">
            {DELIVERY_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setDeliveryMethodId(method.id)}
                className={
                  "w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors " +
                  (deliveryMethodId === method.id
                    ? "border-black bg-[#F3EFE9]"
                    : "border-gray-200 hover:border-gray-300")
                }
              >
                <span className="text-sm text-black">{method.label}</span>
                <span className="text-xs font-semibold text-black">
                  {method.fee === 0 ? "FREE" : `$${method.fee.toFixed(2)}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between text-base font-semibold border-t border-gray-200 pt-4">
          <span className="text-black">Total</span>
          <span className="text-black">${total.toFixed(2)}</span>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className="mt-6 w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50"
        >
          {placing ? "Placing order…" : "Place order"}
        </button>
      </div>
    </Layout>
  );
}

export default CheckoutPage;
