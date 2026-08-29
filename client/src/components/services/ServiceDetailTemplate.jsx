import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../PageBanner";
import ArrowIcon from "../ArrowIcon";
import StarRating from "../StarRating";
import ReviewCard from "../reviews/ReviewCard";
import Seo from "../Seo";
import { FaChevronDown, FaImage, FaCheck } from "react-icons/fa";
import { faqJsonLd, serviceJsonLd } from "../../lib/seo";
import { SERVICE_CATEGORY_TO_QUOTE_LABEL } from "../../lib/serviceQuoteLabels";
import { getGalleryProjects } from "../../lib/api";
import ProjectModal from "../gallery/ProjectModal";

function StatTiles({ tiles }) {
  if (!tiles?.length) return null;
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((tile, i) => (
        <div key={i} className="bg-[#F3EFE9] rounded-sm p-4 text-center sm:text-left">
          <p className="text-lg font-semibold text-black">{tile.value}</p>
          <p className="mt-0.5 text-xs text-gray-500">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}

function SwatchRow({ label, note, swatches, selectedLabel, onSelect }) {
  if (!swatches?.length) return null;
  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <p className="text-sm font-semibold text-black">{label}</p>
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
      <div className="mt-4 flex sm:grid sm:grid-cols-9 gap-4 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 snap-x snap-mandatory sm:snap-none">
        {swatches.map((s) => {
          const isSelected = s.label === selectedLabel;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onSelect(s.label)}
              className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0 sm:shrink w-14 sm:w-auto snap-start"
            >
              <span
                className={
                  "relative w-10 h-10 sm:w-full sm:h-auto rounded-full sm:rounded-sm sm:aspect-square border transition-all " +
                  (isSelected ? "border-black ring-2 ring-black ring-offset-2" : "border-black/10 hover:border-black/30")
                }
                style={{ backgroundColor: s.hex }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <FaCheck className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] text-white" />
                  </span>
                )}
              </span>
              <span
                className={
                  "text-[10px] sm:text-xs text-center leading-tight " +
                  (isSelected ? "font-semibold text-black" : "font-medium text-gray-500")
                }
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Bar heights are derived from each style's own price relative to the other
// options on the same service — no hardcoded pattern, so Colorbond's 1200mm vs
// 2100mm (or Pool Fencing's completely different price range) naturally draw
// differently since they're driven by real pricing data, not a fixed index.
const BAR_JITTER = [0, 9, -6, 7, -9, 5, -3];

function StyleCard({ style, minPrice, maxPrice, selected, onSelect }) {
  const price = style.fromPrice || minPrice;
  const range = Math.max(maxPrice - minPrice, 1);
  const ratio = (price - minPrice) / range;
  const baseHeight = 35 + ratio * 55;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "relative w-full h-full text-left border rounded-sm p-4 transition-colors " +
        (selected
          ? "border-brand-orange"
          : style.popular
          ? "border-black"
          : "border-gray-200 hover:border-gray-400")
      }
    >
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center">
          <FaCheck className="w-2.5 h-2.5" />
        </span>
      )}
      {style.popular && !selected && (
        <span className="absolute top-3 right-3 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          Most popular
        </span>
      )}
      {style.icon ? (
        <div className="h-14 flex items-center">
          <img src={style.icon} alt="" className="max-h-14 max-w-full w-auto h-auto object-contain" />
        </div>
      ) : (
        <div className="flex items-end gap-0.5 h-14">
          {BAR_JITTER.map((jitter, i) => (
            <span
              key={i}
              className="w-1.5 bg-gray-300 rounded-sm"
              style={{ height: `${Math.min(100, Math.max(15, baseHeight + jitter))}%` }}
            />
          ))}
        </div>
      )}
      <p className="mt-3 text-sm font-semibold text-black flex items-center flex-wrap gap-1.5">
        {style.name}
        {style.popular && selected && (
          <span className="text-[9px] font-semibold text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded-full">
            Most popular
          </span>
        )}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">
        {style.fromPrice ? `from $${style.fromPrice} ${style.priceUnit}` : style.priceUnit}
      </p>
    </button>
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

function ServiceDetailTemplate({ service, breadcrumb, path }) {
  const averageRating = service.reviews?.length
    ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
    : null;

  const [linkedProjects, setLinkedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  useEffect(() => {
    if (!service.slug) return;
    getGalleryProjects({ serviceSlug: service.slug })
      .then((data) => setLinkedProjects(data.projects || []))
      .catch(() => {});
  }, [service.slug]);

  const stylePrices = (service.styles || []).map((s) => s.fromPrice).filter((p) => p > 0);
  const minStylePrice = stylePrices.length ? Math.min(...stylePrices) : 0;
  const maxStylePrice = stylePrices.length ? Math.max(...stylePrices) : 0;

  const [selectedColor, setSelectedColor] = useState(service.swatches?.[0]?.label || null);
  const [selectedStyleName, setSelectedStyleName] = useState(
    service.styles?.find((s) => s.popular)?.name || service.styles?.[0]?.name || null
  );
  const selectedStyle = service.styles?.find((s) => s.name === selectedStyleName) || null;
  const quoteLabel = SERVICE_CATEGORY_TO_QUOTE_LABEL[service.category?.slug] || null;

  const serviceSelectionState = {
    serviceSelection: {
      label: quoteLabel,
      serviceName: service.name,
      style: selectedStyle?.name || null,
      color: selectedColor || null,
      price: selectedStyle?.fromPrice ?? service.fromPrice ?? null,
      priceUnit: selectedStyle?.priceUnit || service.priceUnit || null,
    },
  };

  const jsonLd = [
    serviceJsonLd({
      name: service.name,
      description: service.description,
      path,
      image: service.image || service.cardImage,
      price: service.fromPrice,
    }),
  ];
  if (service.faqs?.length) jsonLd.push(faqJsonLd(service.faqs));

  return (
    <>
      <Seo
        title={`${service.name} Perth`}
        description={service.description || `${service.name} installation across Perth. Free on-site measure and a written quote within 48 hours.`}
        path={path}
        image={service.image || service.cardImage}
        jsonLd={jsonLd}
      />
      <PageBanner
        breadcrumb={breadcrumb}
        title={service.bannerTitle || service.name}
        subtitle={service.bannerSubtitle}
        image={service.heroImage}
      >
        <Link
          to="/request-a-quote"
          state={serviceSelectionState}
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
              <div className="bg-[#F3EFE9] rounded-sm p-5">
                <p className="text-xs text-gray-500">FROM</p>
                <p className="text-2xl font-semibold text-black">
                  ${selectedStyle?.fromPrice ?? service.fromPrice}
                  <span className="text-xs font-normal text-gray-500">
                    {" "}
                    {selectedStyle?.priceUnit || service.priceUnit}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">Supplied & installed · fixed written quote</p>

                {(selectedStyle || selectedColor) && (
                  <div className="mt-3 pt-3 border-t border-black/10 text-xs text-gray-600">
                    <p className="font-medium text-black">Your selection</p>
                    {selectedStyle && <p className="mt-1">{selectedStyle.name}</p>}
                    {selectedColor && <p>{selectedColor}</p>}
                  </div>
                )}

                <Link
                  to="/request-a-quote"
                  state={serviceSelectionState}
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

        <SwatchRow
          label={service.swatchGroupLabel}
          note={service.swatchNote}
          swatches={service.swatches}
          selectedLabel={selectedColor}
          onSelect={setSelectedColor}
        />

        {service.styles?.length > 0 && (
          <div className="mt-10">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <p className="text-sm font-semibold text-black">{service.stylesLabel || "Styles & pricing"}</p>
              <p className="sm:hidden text-xs text-gray-400">← swipe · prices exclude GST</p>
            </div>
            <div className="mt-4 flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 snap-x snap-mandatory sm:snap-none">
              {service.styles.map((style) => (
                <div key={style.name} className="w-36 sm:w-auto shrink-0 sm:shrink snap-start">
                  <StyleCard
                    style={style}
                    minPrice={minStylePrice}
                    maxPrice={maxStylePrice}
                    selected={style.name === selectedStyleName}
                    onSelect={() => setSelectedStyleName(style.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {service.identificationCards?.length > 0 && (
          <div className="mt-10">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <p className="text-sm font-semibold text-black">{service.identificationTitle}</p>
              {service.identificationSubtitle && (
                <p className="text-xs text-gray-400">{service.identificationSubtitle}</p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {service.identificationCards.map((card, i) => (
                <div key={i} className="border border-gray-200 rounded-sm p-4">
                  <div className="rounded-sm overflow-hidden bg-gray-100 h-28 mb-3 flex items-center justify-center">
                    {card.image ? (
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-black">{card.title}</p>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.everyInstallIncludes?.length > 0 && (
            <div className="bg-[#F3EFE9] rounded-sm p-5">
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
            <div className="border border-gray-200 rounded-sm p-5">
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
          <div className="mt-8 border border-gray-200 border-l-4 border-l-brand-orange rounded-sm p-5">
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

        {linkedProjects.length > 0 ? (
          <div className="mt-14">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-black">{service.recentJobsTitle || "Recent work"}</p>
              <Link to="/gallery" className="text-xs font-medium text-black underline">
                View full gallery →
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {linkedProjects.slice(0, 3).map((project) => (
                <button
                  key={project._id}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="relative rounded-sm overflow-hidden bg-gray-100 h-40 block text-left"
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <p className="text-xs font-medium text-white">
                      {project.title}
                      {project.suburb ? ` · ${project.suburb}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          service.recentJobs?.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-black">{service.recentJobsTitle}</p>
                <Link to="/gallery" className="text-xs font-medium text-black underline">
                  View full gallery →
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {service.recentJobs.map((job, i) => (
                  <div key={i} className="relative rounded-sm overflow-hidden bg-gray-100 h-40">
                    {job.image && <img src={job.image} alt="" className="w-full h-full object-cover" />}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                      <p className="text-xs font-medium text-white">{job.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
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

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} hideActionLinks />
      )}
    </>
  );
}

export default ServiceDetailTemplate;
