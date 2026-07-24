import Hero from "../components/Hero";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews";
import RecentProjects from "../components/RecentProjects";
import Process from "../components/Process";
import ShopPreview from "../components/ShopPreview";
import AboutUs from "../components/AboutUs";
import Articles from "../components/Articles";
import Footer from "../components/Footer";
import Seo from "../components/Seo";

function Home() {
  return (
    <div className="bg-white">
      <Seo
        title="Fencing Contractor Perth"
        description="Stag Fencing builds and repairs Colorbond, pool, slat, security and retaining wall fencing across Perth and WA. Free on-site measure, written quote within 48 hours, 10 year workmanship warranty."
        path="/"
      />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Reviews />
      <RecentProjects />
      <Process />
      <ShopPreview />
      <AboutUs />
      <Articles />
      <Footer />
    </div>
  );
}

export default Home;
