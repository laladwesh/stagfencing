import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Calculators", href: "/calculators" },
  { label: "Gallery", href: "/gallery" },
  { label: "About us", href: "/about-us" },
  { label: "Resources", href: "/resources" },
];

function Navbar() {
  const location = useLocation();

  return (
    <div className="px-4 sm:px-6 pb-4">
      <nav className="max-w-8xl mx-auto bg-white rounded-full shadow-lg shadow-black/5 flex items-center justify-between gap-4 pl-4 pr-2 py-2">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/stag-icon.svg"
            alt="Stag Fencing"
            className="h-14 w-auto"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className={
                    "group relative inline-block py-1 " +
                    (isActive ? "text-gray-900 font-semibold" : "hover:text-gray-900 transition-colors")
                  }
                >
                  {link.label}
                  <span
                    className={
                      "absolute left-1/2 -bottom-1 h-0.5 w-2/5 -translate-x-1/2 bg-gray-900 rounded-full transition-opacity " +
                      (isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                    }
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            aria-label="Search"
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
          <button
            type="button"
            aria-label="Cart"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
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
          </button>
          <button
            type="button"
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
          </button>

          <Link
            to="/request-a-quote"
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
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
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
