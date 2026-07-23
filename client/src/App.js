import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ShopPage from "./pages/ShopPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import GalleryPage from "./pages/GalleryPage";
import AboutUsPage from "./pages/AboutUsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ContactPage from "./pages/ContactPage";
import RequestQuotePage from "./pages/RequestQuotePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/request-a-quote" element={<RequestQuotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
