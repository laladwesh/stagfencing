import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import ArrowIcon from "../ArrowIcon";

export function CardPaymentElement() {
  return <PaymentElement />;
}

export function CardPayButton({ amountLabel, onPaid, onError, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    onError("");
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    setSubmitting(false);
    if (error) {
      onError(error.message);
      return;
    }
    onPaid(paymentIntent);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || submitting || !stripe}
      className="group w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
    >
      {submitting ? "Processing…" : `Pay ${amountLabel}`}
      <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
        <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </button>
  );
}
