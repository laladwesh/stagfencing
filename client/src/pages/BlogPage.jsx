import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ArrowIcon from "../components/ArrowIcon";
import { ARTICLES } from "../data/articles";

function QuoteCta({ label }) {
  return (
    <Link
      to="/request-a-quote"
      className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
    >
      {label}
      <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
        <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </Link>
  );
}

function BlogPage() {
  return (
    <Layout>
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,15,10,0.55) 0%, rgba(20,15,10,0.65) 100%), url('/hero-bg.png')",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center text-white">
          <p className="text-xs text-gray-300">Home / Articles</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold">Articles</h1>
          <p className="mt-3 text-gray-200">Fencing advice, guides and news from the Stag crew.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <QuoteCta label="Get A Free Quote" />
            <QuoteCta label="Get A Free Quote" />
          </div>
        </div>
      </div>

      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {ARTICLES.map((article) => (
              <Link key={article.slug} to={`/blog/${article.slug}`} className="block">
                <div className="relative rounded-xl overflow-hidden">
                  <img src="/hero-bg.png" alt="" className="w-full h-48 object-cover" />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                    🕐 {article.readTime}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-full shrink-0">
                    {article.tag}
                  </span>
                  <span className="flex-1 border-t border-dashed border-gray-300" />
                  <span className="text-xs text-gray-400 shrink-0">{article.date}</span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-black leading-snug">{article.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogPage;
