import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children, transparentHeader = false }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!transparentHeader && (
        <div className="sticky top-0 z-50 bg-brand-orange shadow-sm">
          <TopBar />
          <Navbar />
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
