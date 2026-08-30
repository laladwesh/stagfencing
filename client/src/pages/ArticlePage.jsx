import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import LazyImage from "../components/LazyImage";
import { ARTICLES } from "../data/articles";

function ArticleBlocks({ blocks }) {
  return blocks.map((block, i) => {
    if (block.type === "heading") {
      return (
        <h2 key={i} id={block.id}>
          {block.text}
        </h2>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>
              {item.strong && <strong>{item.strong}</strong>} {item.text}
            </li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{block.text}</p>;
  });
}

function FullArticle({ article }) {
  return (
    <>
      <div className="bg-white text-center py-14">
        <Breadcrumb>Home / Article</Breadcrumb>
        <div className="mt-3 flex items-center justify-center gap-3 text-xs">
          <span className="bg-gray-900 text-white px-2.5 py-1 rounded-full">{article.tag}</span>
          <span className="text-gray-400">{article.date}</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-black max-w-2xl mx-auto">{article.title}</h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">{article.excerpt}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-sm overflow-hidden bg-gray-100">
          <LazyImage src={article.coverImage} alt={article.coverAlt || ""} eager className="w-full h-64 sm:h-80 object-cover" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {article.toc?.length > 0 && (
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold tracking-wide text-black">ON THIS PAGE</p>
              <ul className="mt-3 space-y-2">
                {article.toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-sm text-gray-500 hover:text-black transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        <article
          className={
            "prose prose-neutral prose-headings:font-semibold prose-a:text-brand-orange " +
            (article.toc?.length > 0 ? "lg:col-span-3" : "lg:col-span-4")
          }
        >
          <ArticleBlocks blocks={article.blocks} />
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
  const hasContent = article?.blocks?.length > 0;

  return (
    <Layout>
      <Seo
        title={article?.title || "Article not found"}
        description={article?.excerpt || (article ? `${article.tag} — ${article.title}` : undefined)}
        path={`/blog/${slug}`}
        noindex={!hasContent}
      />
      {hasContent ? (
        <FullArticle article={article} />
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
