import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";

const DELIVERY_METHODS = [
  {
    id: "pickup-balcatta",
    label: "Pick up - Balcatta",
    detail: "8 Mumford Place, Balcatta WA 6021 - ready today",
    fee: 0,
  },
  {
    id: "pickup-bunbury",
    label: "Pick up - Bunbury",
    detail: "12 Halifax Drive, Davenport WA 6230 - ready today",
    fee: 0,
  },
  {
    id: "delivery",
    label: "Delivery",
    detail: "Perth metro flat rate",
    fee: 54,
  },
];

const DISCOUNT_CODES = {
  WELCOME10: 0.1,
  TRADE5: 0.05,
};

function formatSelections(selections) {
  if (!selections) return null;
  const entries = Object.entries(selections);
  if (!entries.length) return null;
  return entries.map(([, value]) => value).join(" · ");
}

function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  const [deliveryMethodId, setDeliveryMethodId] = useState(DELIVERY_METHODS[0].id);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const deliveryMethod = DELIVERY_METHODS.find((m) => m.id === deliveryMethodId);
  const discountAmount = subtotal * discountRate;
  const total = Math.max(0, subtotal - discountAmount + deliveryMethod.fee);
  const taxIncluded = total / 11;

  const applyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setDiscountRate(DISCOUNT_CODES[code]);
      setDiscountError("");
    } else {
      setDiscountRate(0);
      setDiscountError("Invalid code");
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="bg-white text-center pt-14 pb-8">
          <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-black">
            Home / Cart
          </span>
        </div>
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-black">Your cart is empty</h1>
          <p className="mt-2 text-sm text-gray-500">Add some fencing supplies to get a price.</p>
          <Link
            to="/shop/colorbond-fencing"
            className="mt-6 inline-block bg-black hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Browse the shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white text-center pt-14 pb-8">
        <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-black">
          Home / Cart
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-gray-200 rounded-2xl divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove"
                  className="text-gray-400 hover:text-black mt-1"
                >
                  ✕
                </button>
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black leading-snug">{item.name}</p>
                  {item.sku && <p className="mt-1 text-xs text-gray-400">SKU: {item.sku}</p>}
                  {formatSelections(item.selections) && (
                    <p className="mt-1 text-xs text-gray-500">{formatSelections(item.selections)}</p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-2 bg-[#F3EFE9] rounded-full px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-black font-semibold w-5"
                    >
                      -
                    </button>
                    <span className="text-sm text-black w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-black font-semibold w-5"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-black">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">${item.unitPrice.toFixed(2)} ea</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-2xl p-5">
            <p className="font-semibold text-black">Delivery</p>
            <div className="mt-3 space-y-2">
              {DELIVERY_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setDeliveryMethodId(method.id)}
                  className={
                    "w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors " +
                    (deliveryMethodId === method.id
                      ? "border-black bg-[#F3EFE9]"
                      : "border-gray-200 hover:border-gray-300")
                  }
                >
                  <div>
                    <p className="text-sm font-medium text-black">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.detail}</p>
                  </div>
                  <span className="text-xs font-semibold text-black shrink-0">
                    {method.fee === 0 ? "FREE" : `$${method.fee.toFixed(2)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-2xl p-5 lg:sticky lg:top-24">
            <p className="font-semibold text-black">Order Summary</p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setDiscountOpen((o) => !o)}
                className="w-full flex items-center justify-between text-sm text-gray-700"
              >
                Have a discount code?
                <span className={"transition-transform " + (discountOpen ? "rotate-180" : "")}>⌄</span>
              </button>
              {discountOpen && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 min-w-0 bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyDiscount}
                    className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {discountError && <p className="mt-1 text-xs text-red-600">{discountError}</p>}
              {discountRate > 0 && (
                <p className="mt-1 text-xs text-green-700">
                  {Math.round(discountRate * 100)}% discount applied
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-black">${subtotal.toFixed(2)}</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-700">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="text-black">
                  {deliveryMethod.fee === 0 ? "Free pickup" : `$${deliveryMethod.fee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span className="text-black">Total</span>
                <span className="text-black">${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">Includes ${taxIncluded.toFixed(2)} Tax</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-full transition-colors"
            >
              Proceed to checkout →
            </button>
            <p className="mt-3 text-xs text-gray-400 text-center">Secure checkout · Visa · Mastercard · Amex</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CartPage;
