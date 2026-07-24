import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder, createPaymentIntent, saveAddress } from "../lib/api";
import { getStripePromise } from "../lib/stripeClient";
import { CardPaymentElement, CardPayButton } from "../components/checkout/StripePaymentForm";

const DELIVERY_METHODS = [
  {
    id: "pickup-balcatta",
    label: "Pick up - Balcatta",
    detail: "8 Mumford Place, Balcatta WA 6021 · ready today",
    fee: 0,
  },
  {
    id: "pickup-bunbury",
    label: "Pick up - Bunbury",
    detail: "12 Halifax Drive, Davenport WA 6230 · ready today",
    fee: 0,
  },
  {
    id: "delivery",
    label: "Delivery",
    detail: "Perth metro flat rate",
    fee: 54,
  },
];

const AU_STATES = ["WA", "NSW", "VIC", "QLD", "SA", "TAS", "ACT", "NT"];

function formatSelections(selections) {
  if (!selections) return null;
  const entries = Object.values(selections);
  return entries.length ? entries.join(" · ") : null;
}

function Field({ label, value, onChange, type = "text", placeholder, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-brand-orange">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-[#F3EFE9] rounded-lg px-3 py-2.5 text-sm focus:outline-none"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-brand-orange">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-[#F3EFE9] rounded-lg px-3 py-2.5 text-sm focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckoutPage() {
  const { user, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [deliveryMethodId, setDeliveryMethodId] = useState(DELIVERY_METHODS[0].id);
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("WA");
  const [postcode, setPostcode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [clientSecret, setClientSecret] = useState(null);

  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const deliveryMethod = DELIVERY_METHODS.find((m) => m.id === deliveryMethodId);
  const total = subtotal + deliveryMethod.fee;
  const taxIncluded = total / 11;
  const stripePromise = getStripePromise();

  useEffect(() => {
    if (!user) return;
    const [first, ...rest] = (user.name || "").split(" ");
    setFirstName(user.address?.firstName || first || "");
    setLastName(user.address?.lastName || rest.join(" ") || "");
    setEmail(user.email || "");
    setPhone(user.address?.phone || "");
    if (user.address) {
      setStreet(user.address.street || "");
      setApartment(user.address.apartment || "");
      setSuburb(user.address.suburb || "");
      setState(user.address.state || "WA");
      setPostcode(user.address.postcode || "");
    }
  }, [user]);

  useEffect(() => {
    if (!stripePromise || paymentMethod !== "card" || total <= 0) return;
    let cancelled = false;
    setClientSecret(null);
    createPaymentIntent(total)
      .then((data) => {
        if (!cancelled) setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, total]);

  const canSubmit = useMemo(() => {
    if (!agreedTerms || !firstName || !lastName || !email || !phone) return false;
    if (deliveryMethodId === "delivery" && (!street || !suburb || !state || !postcode)) return false;
    return true;
  }, [agreedTerms, firstName, lastName, email, phone, deliveryMethodId, street, suburb, state, postcode]);

  const finalizeOrder = async ({ paymentMethod: method, stripePaymentIntentId }) => {
    setPlacing(true);
    setError("");
    try {
      saveAddress({ firstName, lastName, phone, street, apartment, suburb, state, postcode }).catch(() => {});
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
        address: deliveryMethodId === "delivery" ? { street, apartment, suburb, state, postcode } : null,
        notes,
        subtotal,
        discount: 0,
        deliveryFee: deliveryMethod.fee,
        total,
        paymentMethod: method,
        stripePaymentIntentId,
      });
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const handleCardPaid = (paymentIntent) => finalizeOrder({ paymentMethod: "card", stripePaymentIntentId: paymentIntent?.id });
  const handleBankTransfer = () => finalizeOrder({ paymentMethod: "bank_transfer" });

  if (confirmedOrder) {
    return (
      <Layout>
        <Seo title="Checkout" noindex path="/checkout" />
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-black">Order placed</h1>
          <p className="mt-3 text-gray-600">
            Thanks — order <span className="font-semibold text-black">#{confirmedOrder.reference}</span> is
            in.{" "}
            {confirmedOrder.paymentMethod === "bank_transfer"
              ? "Bank transfer details have been emailed to you — your order ships once payment clears."
              : "We'll be in touch to confirm delivery."}
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
        <Seo title="Checkout" noindex path="/checkout" />
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center text-gray-500">Loading…</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Seo title="Checkout" noindex path="/checkout" />
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
        <Seo title="Checkout" noindex path="/checkout" />
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
      <Seo title="Checkout" noindex path="/checkout" />
      <div className="bg-white text-center pt-14 pb-8">
        <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-black">
          Home / Cart / Checkout
        </span>
      </div>

      <Elements
        key={clientSecret || "pending"}
        stripe={stripePromise}
        options={clientSecret ? { clientSecret, appearance: { theme: "stripe" } } : undefined}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-2xl font-semibold text-black">Checkout</h1>

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400">1. YOUR DETAILS</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="First name*" value={firstName} onChange={setFirstName} />
                <Field label="Last name*" value={lastName} onChange={setLastName} />
                <Field label="Email*" type="email" value={email} onChange={setEmail} />
                <Field label="Phone*" value={phone} onChange={setPhone} />
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400">2. DELIVERY</p>
              <div className="mt-3 space-y-2">
                {DELIVERY_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setDeliveryMethodId(method.id)}
                    className={
                      "w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors " +
                      (deliveryMethodId === method.id
                        ? deliveryMethodId === "delivery"
                          ? "border-black bg-black text-white"
                          : "border-black bg-[#F3EFE9]"
                        : "border-gray-200 hover:border-gray-300")
                    }
                  >
                    <div>
                      <p
                        className={
                          "text-sm font-medium " +
                          (deliveryMethodId === method.id && method.id === "delivery" ? "text-white" : "text-black")
                        }
                      >
                        {method.label}
                      </p>
                      <p
                        className={
                          "text-xs " +
                          (deliveryMethodId === method.id && method.id === "delivery"
                            ? "text-gray-300"
                            : "text-gray-500")
                        }
                      >
                        {method.detail}
                      </p>
                    </div>
                    <span
                      className={
                        "text-xs font-semibold shrink-0 " +
                        (deliveryMethodId === method.id && method.id === "delivery" ? "text-white" : "text-black")
                      }
                    >
                      {method.fee === 0 ? "FREE" : `$${method.fee.toFixed(2)}`}
                    </span>
                  </button>
                ))}
              </div>

              {deliveryMethodId === "delivery" && (
                <div className="mt-4 space-y-3">
                  <Field label="Street address*" value={street} onChange={setStreet} placeholder="123 Example St" />
                  <Field
                    label="Apartment, Suite, etc. (optional)"
                    value={apartment}
                    onChange={setApartment}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Suburb*" value={suburb} onChange={setSuburb} />
                    <SelectField label="State*" value={state} onChange={setState} options={AU_STATES} />
                    <Field label="Postcode*" value={postcode} onChange={setPostcode} />
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400">3. PAYMENT</p>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={
                    "w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors " +
                    (paymentMethod === "card" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300")
                  }
                >
                  <div>
                    <p className={"text-sm font-medium " + (paymentMethod === "card" ? "text-white" : "text-black")}>
                      Card
                    </p>
                    <p className={"text-xs " + (paymentMethod === "card" ? "text-gray-300" : "text-gray-500")}>
                      Visa · Mastercard · Amex
                    </p>
                  </div>
                  {paymentMethod === "card" && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-white text-black rounded-full px-2 py-1">
                      Secure
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={
                    "w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors " +
                    (paymentMethod === "bank_transfer"
                      ? "border-black bg-[#F3EFE9]"
                      : "border-gray-200 hover:border-gray-300")
                  }
                >
                  <div>
                    <p className="text-sm font-medium text-black">Direct bank transfer (EFT)</p>
                    <p className="text-xs text-gray-500">Pay by bank, no card fee</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 border border-gray-200 rounded-xl p-4">
                  {!stripePromise ? (
                    <p className="text-sm text-amber-700">
                      Card payments aren't configured yet — add a Stripe publishable key to enable this.
                    </p>
                  ) : clientSecret ? (
                    <CardPaymentElement />
                  ) : (
                    <p className="text-sm text-gray-500">Preparing payment…</p>
                  )}
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="mt-4 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                  Bank details will be emailed to you once your order is placed. Your order ships once payment
                  clears in our account.
                </div>
              )}

              <button
                type="button"
                onClick={() => setNotesOpen((o) => !o)}
                className="mt-5 text-sm font-medium text-gray-700 hover:text-black"
              >
                + Add delivery notes (optional)
              </button>
              {notesOpen && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate codes, dog on site, where to leave panels, etc."
                  rows={3}
                  className="mt-3 w-full bg-[#F3EFE9] rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none"
                />
              )}

              <label className="mt-5 flex items-start gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/privacy-policy" className="text-brand-orange font-medium">
                    terms &amp; conditions
                  </Link>{" "}
                  and understand large panels may need a site-access check before delivery.
                </span>
              </label>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="border border-gray-200 rounded-2xl p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-black">Your estimate</p>
                <Link to="/cart" className="text-xs text-gray-500 underline">
                  Edit cart
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-gray-100 overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black truncate">{item.name}</p>
                      {formatSelections(item.selections) && (
                        <p className="text-xs text-gray-400 truncate">{formatSelections(item.selections)}</p>
                      )}
                    </div>
                    <p className="text-sm text-black shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-black">
                    {deliveryMethod.fee === 0 ? "Free · pickup" : `$${deliveryMethod.fee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                  <span className="text-black">Total</span>
                  <span className="text-black">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400">Includes ${taxIncluded.toFixed(2)} tax</p>
              </div>

              {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

              <div className="mt-5">
                {paymentMethod === "card" ? (
                  stripePromise && clientSecret ? (
                    <CardPayButton
                      amountLabel={`$${total.toFixed(2)}`}
                      onPaid={handleCardPaid}
                      onError={setError}
                      disabled={!canSubmit || placing}
                    />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full bg-black text-white font-medium py-3 rounded-full opacity-50"
                    >
                      Preparing payment…
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleBankTransfer}
                    disabled={!canSubmit || placing}
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50"
                  >
                    {placing ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
                  </button>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">Encrypted &amp; secure · incl. tax</p>
            </div>
          </aside>
        </div>
      </Elements>
    </Layout>
  );
}

export default CheckoutPage;
