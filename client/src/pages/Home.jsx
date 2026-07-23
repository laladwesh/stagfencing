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

function Home() {
  return (
    <div className="bg-white">
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
