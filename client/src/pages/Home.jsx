import Hero from "../components/Hero";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews";
import RecentProjects from "../components/RecentProjects";
import Process from "../components/Process";
import AboutUs from "../components/AboutUs";
import Articles from "../components/Articles";
import Footer from "../components/Footer";
import Seo from "../components/Seo";

function Home() {
  return (
    <div className="bg-white">
      <Seo
        title="Colorbond & PVC Fencing Perth | Gates, Slat & Pool Fences| Stag Fencing"
        description="Trusted Perth fencing contractors offering Colorbond, aluminium slat, pool fencing, retaining walls & gates. Get a free, fixed-price quote today!"
        path="/"
      />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Reviews />
      <RecentProjects />
      <Process />
      {/* <ShopPreview /> */}
      <AboutUs />
      <Articles />
      <Footer />
      <div className="h-16 lg:hidden" />
    </div>
  );
}

export default Home;
