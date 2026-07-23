import {
  FaStar,
  FaFacebookF,
  FaInstagram,
  FaGoogle,
  FaShieldAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRegClock,
} from "react-icons/fa";

function ArrowIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 1.875C10.5 1.77554 10.4605 1.68016 10.3902 1.60984C10.3198 1.53951 10.2244 1.5 10.125 1.5H5.62498C5.52553 1.5 5.43015 1.53951 5.35982 1.60984C5.28949 1.68016 5.24998 1.77554 5.24998 1.875C5.24998 1.97446 5.28949 2.06984 5.35982 2.14016C5.43015 2.21049 5.52553 2.25 5.62498 2.25H9.21973L1.60949 9.8595C1.57462 9.89437 1.54696 9.93576 1.52809 9.98131C1.50922 10.0269 1.49951 10.0757 1.49951 10.125C1.49951 10.1743 1.50922 10.2231 1.52809 10.2687C1.54696 10.3142 1.57462 10.3556 1.60949 10.3905C1.64435 10.4254 1.68574 10.453 1.7313 10.4719C1.77685 10.4908 1.82568 10.5005 1.87499 10.5005C1.92429 10.5005 1.97312 10.4908 2.01867 10.4719C2.06423 10.453 2.10562 10.4254 2.14049 10.3905L9.74998 2.78025V6.375C9.74998 6.47446 9.78949 6.56984 9.85982 6.64016C9.93015 6.71049 10.0255 6.75 10.125 6.75C10.2244 6.75 10.3198 6.71049 10.3902 6.64016C10.4605 6.56984 10.5 6.47446 10.5 6.375V1.875Z"
        fill="currentColor"
      />
    </svg>
  );
}

const FENCING_LINKS = [
  "Colorbond",
  "Pool & glass",
  "Aluminium slat",
  "Security fencing",
  "Retaining walls",
  "Gates & automation",
];
const SHOP_LINKS = ["Shop all products", "Panels & posts", "Gates & hardware", "Fencing accessories", "Gate motors"];
const COMPANY_LINKS = ["About us", "Gallery", "About us", "Contact"];
const SUPPORT_LINKS = ["Fencing calculator", "Warranty", "Delivery", "Returns", "FAQs"];

const SOCIAL_ICONS = [FaFacebookF, FaInstagram, FaGoogle];

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link, i) => (
          <li key={`${link}-${i}`}>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LocationCard({ city, address, hours, phone }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="flex items-center gap-2 text-white font-semibold">
        <FaMapMarkerAlt className="w-4 h-4 text-brand-orange" />
        {city}
      </p>
      <div className="mt-3 space-y-2 text-sm text-gray-400">
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="w-3.5 h-3.5 shrink-0" />
          {address}
        </p>
        <p className="flex items-center gap-2">
          <FaRegClock className="w-3.5 h-3.5 shrink-0" />
          {hours}
        </p>
        <p className="flex items-center gap-2">
          <FaPhoneAlt className="w-3 h-3 shrink-0" />
          {phone}
        </p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold">Fencing sorted — start to finish.</h3>
            <p className="mt-1 text-sm text-gray-400">
              Free on-site measure and a clear written quote, usually within a couple of days.
            </p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <a
              href="/contact-us"
              className="group inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
            >
              Get A Free Quote
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center">
                <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </a>
            <a href="tel:0431703770" className="flex items-center gap-2 text-sm font-medium text-white">
              <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <FaPhoneAlt className="w-3 h-3" />
              </span>
              0431 703 770
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10" />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <img src="/stag-icon.svg" alt="Stag Fencing" className="h-9 w-auto" />
            <p className="mt-1 text-xs font-semibold tracking-wide text-brand-orange">PERTH · WA</p>

            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              One of Western Australia's trusted fencing contractors — supply and install done properly,
              from Perth to the South West.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="w-3 h-3" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">5.0</span>
              <span className="text-xs text-gray-400">300+ Google reviews</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-gray-500">
              <FaShieldAlt className="w-3.5 h-3.5 text-brand-orange" />
              Licensed & insured · WA-owned · Workmanship warranty
            </p>
          </div>

          <FooterColumn title="FENCING" links={FENCING_LINKS} />
          <FooterColumn title="SHOP" links={SHOP_LINKS} />
          <FooterColumn title="COMPANY" links={COMPANY_LINKS} />
          <FooterColumn title="SUPPORT" links={SUPPORT_LINKS} />
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <LocationCard
            city="Perth · Balcatta"
            address="8 Mumford Place, Balcatta WA 6021"
            hours="Mon-Fri 7:30am - 3:00pm"
            phone="0431 703 770"
          />
          <LocationCard
            city="Bunbury · South West"
            address="12 Halifax Drive, Davenport WA 6230"
            hours="Mon-Fri 7:30am - 3:00pm"
            phone="0431 703 770"
          />

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-white font-semibold">Stay in the loop</p>
            <p className="mt-1 text-sm text-gray-400">Seasonal fencing deals and the odd DIY tip. No spam.</p>
            <form className="mt-4 flex items-center gap-2">
              <input
                type="email"
                placeholder="you@gmail.com"
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30"
              />
              <button
                type="submit"
                className="bg-brand-orange hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors shrink-0"
              >
                Join
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">Unsubscribe any time.</p>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          Proudly servicing Perth metro · Joondalup · Wanneroo · Rockingham · Mandurah · Bunbury & the South
          West
        </p>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Stag Fencing · ABN TBC · All prices incl GST</p>
          <div className="flex items-center gap-4">
            <a href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
