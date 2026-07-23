import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ServiceCategoryPage from "./pages/ServiceCategoryPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ShopPage from "./pages/ShopPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import GalleryPage from "./pages/GalleryPage";
import AboutUsPage from "./pages/AboutUsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ContactPage from "./pages/ContactPage";
import RequestQuotePage from "./pages/RequestQuotePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import FenceCalculatorPage from "./pages/FenceCalculatorPage";
import RetainingCalculatorPage from "./pages/RetainingCalculatorPage";
import FaqPage from "./pages/FaqPage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyAccountPage from "./pages/MyAccountPage";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#000",
                  color: "#fff",
                  borderRadius: "9999px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                },
                success: { iconTheme: { primary: "#fff", secondary: "#000" } },
                error: { iconTheme: { primary: "#fff", secondary: "#B83A31" } },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:categorySlug" element={<ServiceCategoryPage />} />
              <Route path="/services/:categorySlug/:serviceSlug" element={<ServiceDetailPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/calculators" element={<CalculatorsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/request-a-quote" element={<RequestQuotePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
              <Route path="/calculators/fence-calculator" element={<FenceCalculatorPage />} />
              <Route path="/calculators/retaining-calculator" element={<RetainingCalculatorPage />} />
              <Route path="/faqs" element={<FaqPage />} />
              <Route path="/shop/:categorySlug" element={<ProductListingPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/product/:slug/reviews" element={<ProductReviewsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/my-account" element={<MyAccountPage />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
