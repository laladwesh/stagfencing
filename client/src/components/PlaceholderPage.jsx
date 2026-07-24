import Layout from "./Layout";
import Seo from "./Seo";

function PlaceholderPage({ title, description, path }) {
  return (
    <Layout>
      <Seo title={title} description={description || "This page is coming soon."} path={path} noindex />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-black">{title}</h1>
        <p className="mt-4 text-gray-600">{description || "This page is coming soon."}</p>
      </div>
    </Layout>
  );
}

export default PlaceholderPage;
