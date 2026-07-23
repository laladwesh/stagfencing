import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Layout from "../components/Layout";
import { FAQS } from "../data/faqs";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <div className="bg-white text-center pt-14 pb-8">
        <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-black">
          FAQs
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-black">Questions worth asking first</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Answers to what Perth homeowners ask before booking a measure.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="border-t border-gray-200">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base sm:text-lg font-medium text-black">{faq.question}</span>
                  <FaChevronDown
                    className={
                      "w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </button>
                <div
                  className={
                    "grid transition-[grid-template-rows] duration-300 ease-in-out " +
                    (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                  }
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm text-gray-600 leading-relaxed max-w-2xl">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default FaqPage;
