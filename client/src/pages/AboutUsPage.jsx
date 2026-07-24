import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Layout from "../components/Layout";
import Seo from "../components/Seo";

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AboutUsPage() {
  return (
    <Layout>
      <Seo
        title="About Stag Fencing"
        description="Local Perth fencing contractor with 500+ fences built, a 5-star Google rating and a 10 year workmanship warranty."
        path="/about-us"
      />
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              ABOUT STAG FENCING
            </span>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-black leading-tight">
              Fences built to outlast the weather — and the trends.
            </h1>

            <p className="mt-4 text-gray-600 leading-relaxed max-w-md">
              We're a Western Australian fencing team that supplies and installs fencing the right way:
              quality materials, straight pricing, and crews who turn up and finish the job. Perth to
              Bunbury, residential to commercial.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/request-a-quote"
                className="bg-black hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Get a free quote
              </Link>
              <Link
                to="/gallery"
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                See our work
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <GoogleIcon />
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="w-3.5 h-3.5" />
                ))}
              </div>
              <span className="text-sm font-semibold text-black">5.0</span>
              <span className="text-xs text-gray-500">300+ Google reviews</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden">
            <img src="/hero-bg.png" alt="" className="w-full h-64 object-cover" />
          </div>
        </div>
      </div>

      <div className="bg-[#F3EFE9] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden order-2 lg:order-1">
            <img src="/hero-bg.png" alt="" className="w-full h-64 object-cover" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              WHO WE ARE
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-black leading-tight">
              A local crew that treats your boundary like our own.
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Stag Fencing started with a simple frustration: too many fencing companies overpromising and
              underdelivering. We built a business around the opposite — measure properly, use materials
              that suit the job, tell you exactly what it'll cost, and stand behind the work.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Today we run our own installation crews, not subcontractors, across Perth metro and the South
              West. From a single Colorbond backyard fence to a full commercial security fencing job, the
              standard doesn't change.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <img src="/founder.png" alt="" className="w-10 h-10 rounded-full object-cover bg-gray-300" />
              <div>
                <p className="text-sm font-semibold text-black">The Stag Fencing team</p>
                <p className="text-xs text-gray-500">Perth, WA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutUsPage;
