import { useEffect, useRef, useState } from "react";

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      className={"shrink-0 transition-transform duration-200 " + (open ? "rotate-180" : "")}
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

/**
 * Site-wide custom dropdown, styled to match the Navbar mega-dropdowns
 * (white rounded panel, hover:bg-[#F3EFE9]) instead of the native <select>
 * popup, which renders with inconsistent OS/browser chrome.
 *
 * options: array of strings, or { label, value } objects.
 */
function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
  buttonClassName = "text-sm text-gray-800",
  align = "left",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const normalized = options.map((option) => (typeof option === "string" ? { label: option, value: option } : option));
  const selected = normalized.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={"relative " + className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={"w-full flex items-center justify-between gap-2 text-left " + buttonClassName}
      >
        <span className={"truncate " + (selected ? "" : "text-gray-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          className={
            "absolute z-50 mt-1.5 min-w-full w-max max-w-xs bg-white rounded-sm shadow-lg shadow-black/10 border border-gray-100 p-1.5 max-h-64 overflow-auto " +
            (align === "right" ? "right-0" : "left-0")
          }
        >
          {normalized.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={
                  "block w-full text-left px-3 py-2 rounded-sm text-sm transition-colors whitespace-nowrap " +
                  (isSelected ? "bg-[#F3EFE9] text-black font-medium" : "text-gray-700 hover:bg-[#F3EFE9]")
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;
