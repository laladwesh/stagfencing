import { useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../PageBanner";
import ArrowIcon from "../ArrowIcon";
import StarRating from "../StarRating";
import ReviewCard from "../reviews/ReviewCard";
import { FaChevronDown } from "react-icons/fa";

function StatTiles({ tiles }) {
  if (!tiles?.length) return null;
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((tile, i) => (
        <div key={i} className="bg-[#F3EFE9] rounded-xl p-4 text-center sm:text-left">
          <p className="text-lg font-semibold text-black">{tile.value}</p>
          <p className="mt-0.5 text-xs text-gray-500">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}

function SwatchRow({ label, note, swatches }) {
  if (!swatches?.length) return null;
  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <p className="text-sm font-semibold text-black">{label}</p>
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
      <div className="mt-4 grid grid-cols-5 sm:grid-cols-9 gap-3">
        {swatches.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5">
            <span
              className="w-12 h-10 rounded-lg border border-black/10 shrink-0"
              style={{ backgroundColor: s.hex }}
            />
            <span className="text-[11px] text-gray-500 text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StyleCard({ style }) {
  return (
    <div
      className={
        "relative border rounded-xl p-4 " + (style.popular ? "border-black" : "border-gray-200")
      }
    >
      {style.popular && (
        <span className="absolute top-3 right-3 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          Most popular
        </span>
      )}
      <div className="flex items-end gap-0.5 h-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="w-1.5 bg-gray-300 rounded-sm" style={{ height: `${40 + ((i * 13) % 60)}%` }} />
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-black">{style.name}</p>
      <p className="mt-0.5 text-xs text-gray-500">
        {style.fromPrice ? `from $${style.fromPrice} ${style.priceUnit}` : style.priceUnit}
      </p>
    </div>
  );
}

function FaqAccordion({ title, faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs?.length) return null;

  return (
    <div className="mt-14">
      <h2 className="text-xl font-semibold text-black">{title}</h2>
      <div className="mt-4 border-t border-gray-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="border-b border-gray-200">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-black">{faq.question}</span>
                <FaChevronDown
                  className={
                    "w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-300 " +
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
                  <p className="pb-4 text-sm text-gray-600 leading-relaxed max-w-2xl">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ServiceDetailTemplate({ service, breadcrumb }) {
  const averageRating = service.reviews?.length
    ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
    : null;

  return (
    <>
      <PageBanner breadcrumb={breadcrumb} title={service.bannerTitle || service.name} subtitle={service.bannerSubtitle}>
        <Link
          to="/request-a-quote"
          className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
        >
          {service.bannerCta || "Get A Free Quote"}
          <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
            <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
      </PageBanner>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-black">{service.title}</h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">{service.description}</p>
            {service.trustBadges?.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {service.trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-block border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {service.fromPrice != null && (
            <div className="lg:col-span-1">
              <div className="bg-[#F3EFE9] rounded-xl p-5">
                <p className="text-xs text-gray-500">FROM</p>
                <p className="text-2xl font-semibold text-black">
                  ${service.fromPrice}
                  <span className="text-xs font-normal text-gray-500"> {service.priceUnit}</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">Supplied & installed · fixed written quote</p>
                <Link
                  to="/request-a-quote"
                  className="group mt-4 inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
                >
                  Get A Free Quote
                  <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                    <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </Link>
                <p className="mt-3 text-xs text-gray-500">or call 0431 703 770 · free on-site measure</p>
              </div>
            </div>
          )}
        </div>

        <StatTiles tiles={service.statTiles} />

        <SwatchRow label={service.swatchGroupLabel} note={service.swatchNote} swatches={service.swatches} />

        {service.styles?.length > 0 && (
          <div className="mt-10">
            <p className="text-sm font-semibold text-black">{service.stylesLabel || "Styles & pricing"}</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {service.styles.map((style) => (
                <StyleCard key={style.name} style={style} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.everyInstallIncludes?.length > 0 && (
            <div className="bg-[#F3EFE9] rounded-xl p-5">
              <p className="text-sm font-semibold text-black">Every install includes</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {service.everyInstallIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-700 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service.popularAddOns?.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-black">Popular add-ons</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {service.popularAddOns.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {service.waRules?.length > 0 && (
          <div className="mt-8 border border-gray-200 border-l-4 border-l-brand-orange rounded-xl p-5">
            <p className="text-sm font-semibold text-black">{service.waRulesTitle}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
              {service.waRules.map((rule) => (
                <li key={rule}>· {rule}</li>
              ))}
            </ul>
          </div>
        )}

        {service.processSteps?.length > 0 && (
          <div className="mt-14">
            <p className="text-sm font-semibold text-black">{service.processTitle}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {service.processSteps.map((step, i) => (
                <div key={step.title}>
                  <span className="w-8 h-8 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-black">{step.title}</p>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.recentJobs?.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-black">{service.recentJobsTitle}</p>
              <Link to="/gallery" className="text-xs font-medium text-black underline">
                View full gallery →
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {service.recentJobs.map((job, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 h-40">
                  {job.image && <img src={job.image} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <p className="text-xs font-medium text-white">{job.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.reviews?.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm font-semibold text-black">What Perth homeowners say</p>
              {averageRating && (
                <div className="flex items-center gap-2">
                  <StarRating value={averageRating} />
                  <span className="text-sm font-semibold text-black">{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">· 300+ Google reviews</span>
                </div>
              )}
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {service.reviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </div>
        )}

        <FaqAccordion title={service.faqTitle} faqs={service.faqs} />

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {service.relatedServices?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500">Related services</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {service.relatedServices.map((label) => (
                  <span
                    key={label}
                    className="inline-block border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {service.areasServiced?.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500">Areas we service</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {service.areasServiced.map((area) => (
                <span
                  key={area}
                  className="inline-block border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServiceDetailTemplate;
