import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { ARTICLES } from "../data/articles";

const TOC = [
  { id: "start-with-the-job", label: "Start with the job, not the material" },
  { id: "match-the-material", label: "Match the material to WA conditions" },
  { id: "what-it-costs", label: "What fencing actually costs in Perth" },
];

const PRIMARY_JOBS = [
  { name: "Privacy", detail: "screening a yard from neighbours and the street. Drives height and solidity." },
  { name: "Pool safety", detail: "a compliant barrier around a pool. This one isn't a preference, it's the law." },
  { name: "Security", detail: "a genuine deterrent to entry. Drives height, top rail and footholds." },
  { name: "Kerb appeal", detail: "a front feature that suits the house. Drives style over pure function." },
  { name: "Containment", detail: "keeping kids or pets safe in." },
];

const COST_GUIDE = [
  { item: "Colorbond", price: "approx. $150–$220 per linear metre, including posts and rails" },
  { item: "Aluminium slat", price: "approx. $180–$260 per linear metre, more for larger profiles" },
  { item: "Pool fencing (frameless glass)", price: "approx. $350–$500 per linear metre" },
  { item: "Timber paling", price: "approx. $90–$150 per linear metre, shortest lifespan in WA conditions" },
];

function FeaturedArticle() {
  return (
    <>
      <div className="bg-white text-center py-14">
        <p className="text-xs text-gray-400">Home / Article</p>
        <div className="mt-3 flex items-center justify-center gap-3 text-xs">
          <span className="bg-gray-900 text-white px-2.5 py-1 rounded-full">Buying Guide</span>
          <span className="text-gray-400">13 Feb 2026</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-black max-w-2xl mx-auto">
          How to choose the right fence for your Perth property
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Start with the job the fence has to do, match the material to WA conditions, then set a budget. A
          practical walk-through, with real per-metre costs and what actually has to comply.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img src="/hero-bg.png" alt="" className="w-full h-64 sm:h-80 object-cover" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-wide text-black">ON THIS PAGE</p>
            <ul className="mt-3 space-y-2">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-gray-500 hover:text-black transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <article className="prose prose-neutral prose-headings:font-semibold prose-a:text-brand-orange lg:col-span-3">
          <h2 id="start-with-the-job">Start with the job, not the material</h2>
          <p>
            Most fencing decisions go wrong at the same point: people pick a material before they've decided
            what the fence is actually for. Colour, style and budget all follow from the job — so name the
            job first.
          </p>
          <p>Almost every fence in Perth is doing one of these primary jobs:</p>
          <ul>
            {PRIMARY_JOBS.map((job) => (
              <li key={job.name}>
                <strong>{job.name}</strong> — {job.detail}
              </li>
            ))}
          </ul>
          <p>
            A fence can do several of these at once, but it's usually one priority. Get that straight and
            later choices — material, height, gates — narrow on their own.
          </p>

          <h2 id="match-the-material">Match the material to WA conditions</h2>
          <p>
            Perth throws sun, coastal salt and reactive clay at a fence. The material that lasts on your
            block depends as much on where you are as what you like the look of. Coastal suburbs punish
            unpainted steel, timber moves with the seasons, and powder-coated aluminium and Colorbond handle
            the climate with the least fuss.
          </p>
          <p>
            If you're near the coast, ask specifically about salt-rated hardware — it's the fittings that
            fail first, not the panels.
          </p>

          <h2 id="what-it-costs">What fencing actually costs in Perth</h2>
          <p>
            Prices move with length, height and how much site prep is involved, but as a rough per-metre
            guide for a standard 1.8m fence installed in the Perth metro area:
          </p>
          <ul>
            {COST_GUIDE.map((row) => (
              <li key={row.item}>
                <strong>{row.item}</strong> — {row.price}
              </li>
            ))}
          </ul>
          <p>
            Sloping blocks, retaining work, and gate automation all add to the base rate — that's why we
            quote on-site rather than over the phone.
          </p>
        </article>
      </div>
    </>
  );
}

function ComingSoonArticle({ article }) {
  return (
    <div className="bg-white text-center py-20 sm:py-28">
      <p className="text-xs text-gray-400">Home / Article</p>
      <div className="mt-3 flex items-center justify-center gap-3 text-xs">
        <span className="bg-gray-900 text-white px-2.5 py-1 rounded-full">{article.tag}</span>
        <span className="text-gray-400">{article.date}</span>
      </div>
      <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-black max-w-2xl mx-auto px-4">
        {article.title}
      </h1>
      <p className="mt-4 text-gray-600">The full article is coming soon.</p>
      <Link to="/blog" className="mt-6 inline-block text-sm font-medium text-brand-orange hover:underline">
        ← Back to all articles
      </Link>
    </div>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);

  const isFeatured = slug === "how-to-choose-the-right-fence";

  return (
    <Layout>
      <Seo
        title={article?.title || "Article not found"}
        description={article ? `${article.tag} — ${article.title}` : undefined}
        path={`/blog/${slug}`}
        noindex={!isFeatured}
      />
      {isFeatured ? (
        <FeaturedArticle />
      ) : article ? (
        <ComingSoonArticle article={article} />
      ) : (
        <div className="bg-white text-center py-24">
          <h1 className="text-3xl font-semibold text-black">Article not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-sm font-medium text-brand-orange hover:underline">
            ← Back to all articles
          </Link>
        </div>
      )}
    </Layout>
  );
}

export default ArticlePage;
