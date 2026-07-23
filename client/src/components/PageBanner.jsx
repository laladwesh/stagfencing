import ArrowIcon from "./ArrowIcon";

function PageBanner({ breadcrumb, title, subtitle, ctaLabel, ctaHref }) {
  return (
    <div
      className="relative bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(20,15,10,0.55) 0%, rgba(20,15,10,0.65) 100%), url('/hero-bg.png')",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center text-white">
        <p className="text-xs text-gray-300">{breadcrumb}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-3 text-gray-200">{subtitle}</p>}
        {ctaLabel && (
          <a
            href={ctaHref}
            className="group mt-6 inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
          >
            {ctaLabel}
            <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
              <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

export default PageBanner;
