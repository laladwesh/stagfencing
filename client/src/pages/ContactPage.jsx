import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaRegClock, FaShieldAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import PageBanner from "../components/PageBanner";
import ArrowIcon from "../components/ArrowIcon";

const CONTACT_INFO = [
  {
    icon: FaPhoneAlt,
    title: "Call us",
    detail: "0431 703 770 · Mon–Sat, 7am–5pm",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    detail: "quote@stagfencing.com.au · replies within one business day",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Service area",
    detail: "Perth metro · Joondalup · Wanneroo · Rockingham · Mandurah · Bunbury & the South West",
  },
  {
    icon: FaRegClock,
    title: "Hours",
    detail: "Mon-Fri 7:30am – 5:00pm · Sat by appointment",
  },
];

const SERVICE_OPTIONS = ["Fence Installation", "Fence Repair", "Gate & Automation", "Retaining Wall", "Other"];

function ContactPage() {
  return (
    <Layout transparentHeader>
      <PageBanner
        breadcrumb="Home / Contact Us"
        title="Contact Us"
        subtitle="We're here to help — call, email, or book a free on-site measure."
      >
        <a
          href="tel:0431703770"
          className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
        >
          Call Us Today
          <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
            <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </a>
      </PageBanner>

      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-black">Get in touch</h2>
            <p className="mt-3 text-gray-600 leading-relaxed max-w-md">
              Tell us about your fence, wall or gate and we'll come back with straight answers and a clear
              price — a real person answers.
            </p>

            <ul className="mt-8 space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-black">{title}</p>
                    <p className="text-sm text-gray-600">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-center gap-2 text-xs text-gray-500">
              <FaShieldAlt className="w-3.5 h-3.5 text-brand-orange" />
              Licensed & insured · WA-owned · Workmanship warranty
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-black">Send us a message</h3>
            <p className="mt-1 text-sm text-gray-600">Fill it in and we'll call you back with a price.</p>

            <form className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                Full name*
                <input
                  type="text"
                  required
                  placeholder="Jane Citizen"
                  className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                Phone*
                <input
                  type="tel"
                  required
                  placeholder="0400 000 000"
                  className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange sm:col-span-2">
                Email*
                <input
                  type="email"
                  required
                  placeholder="jane@email.com"
                  className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                Suburb*
                <input
                  type="text"
                  required
                  placeholder="e.g. Joondalup"
                  className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-gray-500">
                Service needed
                <select className="bg-transparent text-sm text-gray-800 focus:outline-none">
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-gray-500 sm:col-span-2">
                Your message
                <textarea
                  rows={2}
                  placeholder="Gate codes, dogs on site, access notes, old fence removal..."
                  className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none"
                />
              </label>

              <div className="sm:col-span-2 mt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors shrink-0"
                >
                  Send Enquiry
                  <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                    <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </button>
                <p className="text-xs text-gray-500">No spam — we only use your details to quote your job.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;
