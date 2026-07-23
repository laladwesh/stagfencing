import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const CALCULATORS = [
  {
    to: "/calculators/fence-calculator",
    title: "Fence Calculator",
    description: "Instant Colorbond estimate — panels, posts and a ballpark price.",
  },
  {
    to: "/calculators/retaining-calculator",
    title: "Retaining Calculator",
    description: "Instant retaining wall estimate — height, length and sleeper system.",
  },
];

function CalculatorsPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold text-black">Calculators</h1>
        <p className="mt-3 text-gray-600 max-w-xl">
          Pick a calculator to get a live Perth-metro price estimate in a couple of minutes — no form, no
          waiting.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.to}
              to={calc.to}
              className="block border border-gray-200 rounded-2xl p-6 hover:border-gray-400 transition-colors"
            >
              <h2 className="text-xl font-semibold text-black">{calc.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{calc.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-brand-orange">Start estimate →</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default CalculatorsPage;
