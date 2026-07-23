import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Reviews from "./components/Reviews";
import RecentProjects from "./components/RecentProjects";
import Process from "./components/Process";
import ShopPreview from "./components/ShopPreview";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Services />
      <WhyChooseUs />
      <Reviews />
      <RecentProjects />
      <Process />
      <ShopPreview />
      <AboutUs />
    </div>
  );
}

export default App;
