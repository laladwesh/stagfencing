import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function CheckoutPage() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-black">Checkout</h1>
        <p className="mt-4 text-gray-600">
          Online payment is coming soon. For now, call us or request a quote and we'll confirm your order and
          take payment over the phone or by EFT.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/cart"
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Back to cart
          </Link>
          <Link
            to="/request-a-quote"
            className="bg-black hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutPage;
