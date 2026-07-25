function ChevronIcon({ open, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      className={"transition-transform duration-200 " + (open ? "rotate-180" : "") + " " + className}
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronIcon;
