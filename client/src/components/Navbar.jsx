import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { getCategories, getServiceCategories } from "../lib/api";
import ServiceCategoryIcon from "./ServiceCategoryIcon";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", dropdown: "services" },
  { label: "Shop", href: "/shop", dropdown: "shop" },
  { label: "Calculators", href: "/calculators", dropdown: "calculators" },
  { label: "Gallery", href: "/gallery" },
  { label: "About us", href: "/about-us" },
  { label: "Resources", href: "/resources", dropdown: "resources" },
];

const CALCULATOR_LINKS = [
  { label: "Colorbond Calculator", description: "instant panel & post estimate", href: "/calculators/fence-calculator" },
  { label: "Retaining Calculator", description: "wall height & sleeper estimate", href: "/calculators/retaining-calculator" },
];

const RESOURCE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Colorbond Colours", href: "/resources/colorbond-colours" },
  { label: "Brochures", href: "/resources/brochures" },
  { label: "FAQs", href: "/faqs" },
];

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
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DropdownPanelWrapper({ innerRef, wide, onNavigate, children }) {
  const handleKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll("a[href]"));
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement);
    const dir = e.key === "ArrowDown" ? 1 : -1;
    let next = currentIndex + dir;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    items[next]?.focus();
  };

  return (
    <div
      ref={innerRef}
      onKeyDown={handleKeyDown}
      onClick={onNavigate}
      className={
        "bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 overflow-hidden " +
        (wide ? "w-[560px]" : "min-w-[220px]")
      }
    >
      {children}
    </div>
  );
}

function ServicesDropdownContent({ categories }) {
  return (
    <div className="p-3">
      <div className="grid grid-cols-2 gap-1">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/services/${category.slug}`}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#F3EFE9] transition-colors"
          >
            <span className="w-9 h-9 rounded-lg bg-[#F3EFE9] text-gray-500 flex items-center justify-center shrink-0">
              <ServiceCategoryIcon slug={category.slug} className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-black truncate">{category.name}</span>
              <span className="block text-xs text-gray-500">
                {category.fromPrice ? `from $${category.fromPrice}${category.priceUnit ? ` / ${category.priceUnit.replace("per ", "")}` : ""}` : ""}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between border-t border-gray-100 px-3 pt-3 text-xs">
        <Link to="/services" className="font-medium text-black hover:underline">
          All services →
        </Link>
        <span className="text-gray-400">Free on-site measure · written quote in 48h</span>
      </div>
    </div>
  );
}

function ShopDropdownContent({ categories }) {
  return (
    <div className="p-3">
      <div className="mt-1">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/shop/${category.slug}`}
            className="block rounded-xl px-3 py-2.5 text-sm text-black hover:bg-[#F3EFE9] transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>
      <div className="mt-1 border-t border-gray-100 px-3 pt-3">
        <Link to="/shop" className="text-xs font-medium text-black hover:underline">
          Shop all products →
        </Link>
      </div>
    </div>
  );
}

function CalculatorsDropdownContent() {
  return (
    <div className="p-3">
      {CALCULATOR_LINKS.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 hover:bg-[#F3EFE9] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2 shrink-0" />
          <span>
            <span className="block text-sm font-medium text-black">{item.label}</span>
            <span className="block text-xs text-gray-500">{item.description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function ResourcesDropdownContent() {
  return (
    <div className="p-3">
      {RESOURCE_LINKS.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="block rounded-xl px-3 py-2.5 text-sm text-black hover:bg-[#F3EFE9] transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [shopCategories, setShopCategories] = useState([]);
  const navListRef = useRef(null);
  const panelRefs = useRef({});
  const triggerRefs = useRef({});
  const focusFirstItemFor = useRef(null);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    getServiceCategories()
      .then((data) => setServiceCategories(data.categories))
      .catch(() => {});
    getCategories()
      .then(setShopCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown) return;
    const dropdownKey = openDropdown;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setOpenDropdown(null);
      triggerRefs.current[dropdownKey]?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e) => {
      if (navListRef.current && !navListRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown || focusFirstItemFor.current !== openDropdown) return;
    focusFirstItemFor.current = null;
    const dropdownKey = openDropdown;
    let attempts = 0;
    const tryFocus = () => {
      const target = panelRefs.current[dropdownKey]?.querySelector("a[href]");
      if (!target) return;
      target.focus();
      if (document.activeElement !== target && attempts < 10) {
        attempts += 1;
        requestAnimationFrame(tryFocus);
      }
    };
    tryFocus();
  }, [openDropdown]);

  const renderDropdownContent = (key) => {
    if (key === "services") return <ServicesDropdownContent categories={serviceCategories} />;
    if (key === "shop") return <ShopDropdownContent categories={shopCategories} />;
    if (key === "calculators") return <CalculatorsDropdownContent />;
    if (key === "resources") return <ResourcesDropdownContent />;
    return null;
  };

  const handleTriggerKeyDown = (e, link) => {
    if (!link.dropdown || e.key !== "ArrowDown") return;
    e.preventDefault();
    focusFirstItemFor.current = link.dropdown;
    setOpenDropdown(link.dropdown);
  };

  return (
    <div className="px-4 sm:px-6 pb-4">
      <nav className="relative max-w-8xl mx-auto bg-white rounded-full shadow-lg shadow-black/5 flex items-center justify-between gap-4 pl-4 pr-2 py-2">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/stag-icon.svg" alt="Stag Fencing" className="h-14 w-auto" />
        </Link>

        <ul
          ref={navListRef}
          className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4 text-sm font-medium text-gray-700"
        >
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            const isOpen = openDropdown === link.dropdown && !!link.dropdown;
            return (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.dropdown)}
                onMouseLeave={() => link.dropdown && setOpenDropdown((cur) => (cur === link.dropdown ? null : cur))}
              >
                <Link
                  to={link.href}
                  ref={link.dropdown ? (el) => (triggerRefs.current[link.dropdown] = el) : undefined}
                  aria-haspopup={link.dropdown ? "true" : undefined}
                  aria-expanded={link.dropdown ? isOpen : undefined}
                  onKeyDown={(e) => handleTriggerKeyDown(e, link)}
                  onClick={() =>
                    link.dropdown && setOpenDropdown((cur) => (cur === link.dropdown ? null : cur))
                  }
                  className={
                    "relative inline-flex items-center gap-1 py-1 " +
                    (isActive ? "text-gray-900 font-semibold" : "hover:text-gray-900 transition-colors")
                  }
                >
                  {link.label}
                  {link.dropdown && <ChevronIcon open={isOpen} className="text-gray-400" />}
                  <span
                    className={
                      "absolute left-1/2 -bottom-1 h-0.5 w-2/5 -translate-x-1/2 bg-gray-900 rounded-full transition-opacity " +
                      (isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                    }
                  />
                </Link>

                {link.dropdown && (
                  <div
                    className={
                      "absolute top-full pt-3 transition-all duration-150 ease-out " +
                      (link.dropdown === "services" ? "left-0" : "left-1/2 -translate-x-1/2") +
                      " " +
                      (isOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none")
                    }
                  >
                    <DropdownPanelWrapper
                      innerRef={(el) => (panelRefs.current[link.dropdown] = el)}
                      wide={link.dropdown === "services"}
                      onNavigate={() => setOpenDropdown(null)}
                    >
                      {renderDropdownContent(link.dropdown)}
                    </DropdownPanelWrapper>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Search"
            onClick={(e) => openSearch(e.currentTarget)}
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_56_4946)">
                <path
                  d="M8.33333 14.1667C11.555 14.1667 14.1667 11.555 14.1667 8.33333C14.1667 5.11167 11.555 2.5 8.33333 2.5C5.11167 2.5 2.5 5.11167 2.5 8.33333C2.5 11.555 5.11167 14.1667 8.33333 14.1667Z"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 17.5L12.5 12.5"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_56_4946">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex w-9 h-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-semibold flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_56_4947)">
                <path
                  d="M5.00004 17.5001C5.92052 17.5001 6.66671 16.7539 6.66671 15.8334C6.66671 14.9129 5.92052 14.1667 5.00004 14.1667C4.07957 14.1667 3.33337 14.9129 3.33337 15.8334C3.33337 16.7539 4.07957 17.5001 5.00004 17.5001Z"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.1667 17.5001C15.0871 17.5001 15.8333 16.7539 15.8333 15.8334C15.8333 14.9129 15.0871 14.1667 14.1667 14.1667C13.2462 14.1667 12.5 14.9129 12.5 15.8334C12.5 16.7539 13.2462 17.5001 14.1667 17.5001Z"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.1667 14.1667H5.00004V2.5H3.33337"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 4.16675L16.6667 5.00008L15.8333 10.8334H5"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_56_4947">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
          <Link
            to="/my-account"
            aria-label="Account"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_56_4948)">
                <path
                  d="M9.99996 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 9.99996 2.5C8.15901 2.5 6.66663 3.99238 6.66663 5.83333C6.66663 7.67428 8.15901 9.16667 9.99996 9.16667Z"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 17.5V15.8333C5 14.9493 5.35119 14.1014 5.97631 13.4763C6.60143 12.8512 7.44928 12.5 8.33333 12.5H11.6667C12.5507 12.5 13.3986 12.8512 14.0237 13.4763C14.6488 14.1014 15 14.9493 15 15.8333V17.5"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_56_4948">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>

          <Link
            to="/request-a-quote"
            className="hidden sm:flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
          >
            Get My Free Quote
            <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.5001 3.125C17.5001 2.95924 17.4342 2.80027 17.317 2.68306C17.1998 2.56585 17.0408 2.5 16.8751 2.5H9.37506C9.2093 2.5 9.05033 2.56585 8.93312 2.68306C8.81591 2.80027 8.75006 2.95924 8.75006 3.125C8.75006 3.29076 8.81591 3.44973 8.93312 3.56694C9.05033 3.68415 9.2093 3.75 9.37506 3.75H15.3663L2.68256 16.4325C2.62445 16.4906 2.57835 16.5596 2.5469 16.6355C2.51545 16.7114 2.49927 16.7928 2.49927 16.875C2.49927 16.9572 2.51545 17.0386 2.5469 17.1145C2.57835 17.1904 2.62445 17.2594 2.68256 17.3175C2.74067 17.3756 2.80965 17.4217 2.88558 17.4532C2.9615 17.4846 3.04288 17.5008 3.12506 17.5008C3.20724 17.5008 3.28861 17.4846 3.36454 17.4532C3.44046 17.4217 3.50945 17.3756 3.56756 17.3175L16.2501 4.63375V10.625C16.2501 10.7908 16.3159 10.9497 16.4331 11.0669C16.5503 11.1842 16.7093 11.25 16.8751 11.25C17.0408 11.25 17.1998 11.1842 17.317 11.0669C17.4342 10.9497 17.5001 10.7908 17.5001 10.625V3.125Z"
                  fill="#0E0E0D"
                />
              </svg>
            </span>
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden relative flex w-9 h-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span
              className={
                "absolute block h-0.5 w-4 bg-black rounded-full transition-all duration-300 ease-in-out " +
                (mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px] rotate-0")
              }
            />
            <span
              className={
                "absolute block h-0.5 w-4 bg-black rounded-full transition-all duration-300 ease-in-out " +
                (mobileOpen ? "opacity-0" : "opacity-100")
              }
            />
            <span
              className={
                "absolute block h-0.5 w-4 bg-black rounded-full transition-all duration-300 ease-in-out " +
                (mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px] rotate-0")
              }
            />
          </button>
        </div>
      </nav>

      <div
        className={
          "lg:hidden max-w-8xl mx-auto overflow-hidden transition-all duration-300 ease-in-out " +
          (mobileOpen ? "max-h-[42rem] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0")
        }
      >
        <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => {
              closeMobile();
              openSearch();
            }}
            className="w-full flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-800 border-b border-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M8.33333 14.1667C11.555 14.1667 14.1667 11.555 14.1667 8.33333C14.1667 5.11167 11.555 2.5 8.33333 2.5C5.11167 2.5 2.5 5.11167 2.5 8.33333C2.5 11.555 5.11167 14.1667 8.33333 14.1667Z"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M17.5 17.5L12.5 12.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Search
          </button>
          <ul className="divide-y divide-gray-100">
            {NAV_LINKS.map((link) => {
              const accordionOpen = mobileAccordion === link.dropdown;
              return (
                <li key={link.label}>
                  <div className="flex items-center">
                    <Link
                      to={link.href}
                      onClick={closeMobile}
                      className="flex-1 block px-5 py-3 text-sm font-medium text-gray-800"
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <button
                        type="button"
                        aria-label={accordionOpen ? `Collapse ${link.label}` : `Expand ${link.label}`}
                        aria-expanded={accordionOpen}
                        onClick={() => setMobileAccordion((cur) => (cur === link.dropdown ? null : link.dropdown))}
                        className="px-4 py-3 text-gray-400"
                      >
                        <ChevronIcon open={accordionOpen} />
                      </button>
                    )}
                  </div>
                  {link.dropdown && (
                    <div
                      className={
                        "overflow-hidden transition-all duration-200 ease-in-out bg-gray-50/50 " +
                        (accordionOpen ? "max-h-[28rem]" : "max-h-0")
                      }
                    >
                      {link.dropdown === "services" && (
                        <div className="px-3 py-2 grid grid-cols-1 gap-1">
                          {serviceCategories.map((c) => (
                            <Link
                              key={c.slug}
                              to={`/services/${c.slug}`}
                              onClick={closeMobile}
                              className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-gray-700"
                            >
                              <ServiceCategoryIcon slug={c.slug} className="w-4 h-4 shrink-0" />
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      {link.dropdown === "shop" && (
                        <div className="px-3 py-2">
                          {shopCategories.map((c) => (
                            <Link
                              key={c.slug}
                              to={`/shop/${c.slug}`}
                              onClick={closeMobile}
                              className="block rounded-lg px-2 py-2 text-sm text-gray-700"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      {link.dropdown === "calculators" && (
                        <div className="px-3 py-2">
                          {CALCULATOR_LINKS.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={closeMobile}
                              className="block rounded-lg px-2 py-2"
                            >
                              <span className="block text-sm text-gray-800">{item.label}</span>
                              <span className="block text-xs text-gray-500">{item.description}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      {link.dropdown === "resources" && (
                        <div className="px-3 py-2">
                          {RESOURCE_LINKS.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={closeMobile}
                              className="block rounded-lg px-2 py-2 text-sm text-gray-700"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="p-4 border-t border-gray-100 flex items-center gap-3">
            <Link
              to="/my-account"
              onClick={closeMobile}
              className="flex-1 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-full py-2.5"
            >
              My Account
            </Link>
            <Link
              to="/request-a-quote"
              onClick={closeMobile}
              className="flex-1 text-center text-sm font-semibold bg-black hover:bg-gray-800 text-white rounded-full py-2.5 transition-colors"
            >
              Get My Free Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
