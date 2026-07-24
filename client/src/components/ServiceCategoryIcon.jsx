const ICONS = {
  "colorbond-fencing": (
    <>
      <rect x="4" y="5" width="2.2" height="14" rx="1" />
      <rect x="8.4" y="5" width="2.2" height="14" rx="1" />
      <rect x="12.8" y="5" width="2.2" height="14" rx="1" />
      <rect x="17.2" y="5" width="2.2" height="14" rx="1" />
    </>
  ),
  "aluminium-slat-fencing-perth": (
    <>
      <rect x="4" y="5" width="16" height="2" rx="1" />
      <rect x="4" y="9.3" width="16" height="2" rx="1" />
      <rect x="4" y="13.7" width="16" height="2" rx="1" />
      <rect x="4" y="18" width="16" height="2" rx="1" />
    </>
  ),
  "pool-fencing": (
    <>
      <rect x="4" y="5" width="7" height="14" rx="1" fill="#BFE0EA" stroke="none" />
      <rect x="13" y="5" width="7" height="14" rx="1" fill="#BFE0EA" stroke="none" />
    </>
  ),
  "retaining-walls": (
    <>
      <rect x="4" y="6" width="16" height="2.6" rx="1" />
      <rect x="4" y="10.7" width="16" height="2.6" rx="1" />
      <rect x="4" y="15.4" width="16" height="2.6" rx="1" />
    </>
  ),
  "gates-automation": (
    <>
      <rect x="4" y="5" width="7" height="14" rx="1" fill="#BFE0EA" stroke="none" />
      <rect x="13" y="5" width="7" height="14" rx="1" fill="#BFE0EA" stroke="none" />
    </>
  ),
  "security-fencing": (
    <>
      <rect x="4" y="5" width="1.8" height="14" rx="0.9" />
      <rect x="7.4" y="5" width="1.8" height="14" rx="0.9" />
      <rect x="10.8" y="5" width="1.8" height="14" rx="0.9" />
      <rect x="14.2" y="5" width="1.8" height="14" rx="0.9" />
      <rect x="17.6" y="5" width="1.8" height="14" rx="0.9" />
    </>
  ),
  "blade-fencing-designer-range": (
    <>
      <rect x="4.5" y="5" width="1.6" height="14" rx="0.8" />
      <rect x="8.8" y="5" width="1.6" height="14" rx="0.8" />
      <rect x="13.1" y="5" width="1.6" height="14" rx="0.8" />
      <rect x="17.4" y="5" width="1.6" height="14" rx="0.8" />
    </>
  ),
  "asbestos-fence-removal": null,
};

function ServiceCategoryIcon({ slug, className = "w-5 h-5" }) {
  if (slug === "asbestos-fence-removal") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 3.5L21 19.5H3L12 3.5Z"
          stroke="#B83A31"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <rect x="11.25" y="9.5" width="1.5" height="5" rx="0.75" fill="#B83A31" />
        <circle cx="12" cy="16.5" r="0.9" fill="#B83A31" />
      </svg>
    );
  }

  const shape = ICONS[slug];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className={className}>
      {shape || <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

export default ServiceCategoryIcon;
