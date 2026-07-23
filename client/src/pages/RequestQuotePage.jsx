import { useEffect, useState } from "react";
import { FaStar, FaPhoneAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import PageBanner from "../components/PageBanner";
import ArrowIcon from "../components/ArrowIcon";

const SERVICE_TYPES = [
  "Colorbond",
  "Slat fencing",
  "Pool fencing",
  "Retaining walls",
  "Gates & automation",
  "Security fencing",
  "Blade range",
  "Asbestos removal",
];

const TIME_SLOTS = ["7-9am", "9-11am", "11am-1pm", "1-3pm", "3-5pm"];

const NEXT_STEPS = [
  { title: "We confirm", description: "A real person calls within one business day." },
  { title: "Free on-site measure", description: "We arrive in your booked window and measure up." },
  { title: "Written quote", description: "Fixed price in your inbox within 48 hours." },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function RequestQuotePage() {
  const days = getWeekDays();
  const todayIndex = days.findIndex((d) => d.toDateString() === new Date().toDateString());

  const [service, setService] = useState(SERVICE_TYPES[0]);
  const [propertyType, setPropertyType] = useState("Residential");
  const [approxLength, setApproxLength] = useState("");
  const [estimateAttached, setEstimateAttached] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex >= 0 ? todayIndex : 2);
  const [selectedTime, setSelectedTime] = useState("9-11am");
  const [noPreference, setNoPreference] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [suburb, setSuburb] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [reference] = useState(() => `SF-${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    document.title = submitted ? "Request a Quote — Confirmed" : "Request a Quote";
  }, [submitted]);

  const monthLabel = `${MONTH_LABELS[days[0].getMonth()]} ${days[0].getFullYear()}`;
  const selectedDay = days[selectedDayIndex];
  const selectedDayLabel = selectedDay.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="bg-white py-16 sm:py-24">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex w-12 h-12 rounded-full bg-black text-white items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl font-semibold text-black">Measure booked</h1>
            <p className="mt-3 text-gray-600">
              Thanks{firstName ? ` ${firstName}` : ""} — you're locked in. A real person will call to confirm
              before we arrive.
            </p>

            <div className="mt-6 bg-[#F3EFE9] rounded-xl px-6 py-5">
              <p className="font-semibold text-black">
                {selectedDayLabel} · {selectedTime} arrival window
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {service} fence · {propertyType}
                {suburb ? ` · ${suburb}` : ""}
                {approxLength ? ` · approx. ${approxLength}` : ""}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Reference #{reference} · Confirmation sent by SMS and email via ServiceM8
              </p>
            </div>

            <ol className="mt-6 space-y-3 text-left inline-block">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-center justify-center gap-5">
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
              >
                Add To Calendar
                <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                  <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </a>
              <a href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Back to home →
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Need to change the time? Call 0431 703 770 — we'll sort it.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageBanner
        breadcrumb="Home / Request a Quote"
        title="Request a Quote"
        subtitle="Tell us about the job and book your free on-site measure — price confirmed in writing."
        ctaLabel="Call Us Today"
        ctaHref="tel:0431703770"
      />

      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-xs font-semibold tracking-wide text-black">1. WHAT DO YOU NEED?</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SERVICE_TYPES.map((type) => {
                  const isSelected = service === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setService(type)}
                      className={
                        "rounded-md px-4 py-3 text-sm font-medium text-left transition-colors " +
                        (isSelected ? "bg-black text-white" : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                      }
                    >
                      {type}
                      {isSelected && (
                        <span className="block text-xs text-gray-300 font-normal mt-0.5">Selected</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Pick the closest match — we'll confirm the details on site.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-semibold tracking-wide text-black">2. ABOUT THE JOB</h2>

              <div className="mt-3 inline-flex rounded-full bg-[#F3EFE9] p-1">
                {["Residential", "Commercial"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPropertyType(option)}
                    className={
                      "px-4 py-1.5 text-sm font-medium rounded-full transition-colors " +
                      (propertyType === option ? "bg-black text-white" : "text-gray-600")
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  Approx. length*
                  <input
                    type="text"
                    required
                    value={approxLength}
                    onChange={(e) => setApproxLength(e.target.value)}
                    placeholder="24 lm"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-gray-500">
                  Timeframe
                  <input
                    type="text"
                    placeholder="In the next month"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
              </div>

              {estimateAttached && (
                <div className="mt-3 flex items-start justify-between gap-3 border border-brand-orange rounded-md px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-black">Colorbond Calculator estimate attached</p>
                    <p className="text-xs text-gray-500">2.4m 1.8m Colorbond, approx. $4,320 inc GST</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEstimateAttached(false)}
                    className="text-xs font-medium text-brand-orange shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}

              <label className="mt-3 flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                Anything else we should know?
                <textarea
                  rows={2}
                  placeholder="Gate codes, dogs on site, access notes, old fence removal..."
                  className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none"
                />
              </label>

              <button
                type="button"
                className="mt-3 w-full border border-dashed border-gray-300 rounded-md py-4 text-center hover:border-gray-400 transition-colors"
              >
                <span className="text-sm font-medium text-black">+ Add site photos (up to 5)</span>
                <p className="text-xs text-gray-500 mt-1">
                  Fence line, corners, slopes — photos help us quote faster.
                </p>
              </button>
            </section>

            <section>
              <h2 className="text-xs font-semibold tracking-wide text-black">3. YOUR DETAILS</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  First name*
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  Last name*
                  <input
                    type="text"
                    required
                    placeholder="Citizen"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  Mobile*
                  <input
                    type="tel"
                    required
                    placeholder="0400 000 000"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  Email*
                  <input
                    type="email"
                    required
                    placeholder="jane@gmail.com"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange sm:col-span-2">
                  Site address*
                  <input
                    type="text"
                    required
                    placeholder="8 Example Street"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  Suburb*
                  <input
                    type="text"
                    required
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="Joondalup"
                    className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                    State*
                    <input
                      type="text"
                      required
                      placeholder="WA"
                      className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                    Postcode*
                    <input
                      type="text"
                      required
                      placeholder="6027"
                      className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold tracking-wide text-black">4. BOOK YOUR FREE MEASURE</h2>
              <p className="mt-1 text-xs text-gray-500">
                Pick a window that suits — measures take about 30 minutes. {monthLabel}
              </p>

              <div className="mt-3 grid grid-cols-7 gap-2">
                {days.map((d, i) => {
                  const isSunday = d.getDay() === 0;
                  const isSelected = i === selectedDayIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isSunday}
                      onClick={() => setSelectedDayIndex(i)}
                      className={
                        "rounded-md py-3 text-center transition-colors " +
                        (isSunday
                          ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-black text-white"
                          : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                      }
                    >
                      <span className="block text-xs">{DAY_LABELS[i]}</span>
                      <span className="block text-sm font-semibold">{isSunday ? "—" : d.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors " +
                      (selectedTime === slot ? "bg-black text-white" : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                    }
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <label className="mt-3 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noPreference}
                  onChange={(e) => setNoPreference(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                No preference — call me to arrange a time
              </label>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors shrink-0"
                >
                  Request My Quote
                  <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                    <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </button>
                <p className="text-xs text-gray-500">
                  Free & no obligation. We'll call within one business day to confirm your measure booking.
                </p>
              </div>
            </section>
          </form>

          <aside className="lg:col-span-1">
            <div className="bg-[#F3EFE9] rounded-2xl p-6 lg:sticky lg:top-24">
              <p className="text-xs font-semibold tracking-wide text-black">WHAT HAPPENS NEXT</p>
              <ol className="mt-4 space-y-4">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-black">{step.title}</p>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 pt-5 border-t border-gray-300/70 flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-black">5.0</span>
                <span className="text-xs text-gray-500">300+ Google reviews</span>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-300/70">
                <p className="text-sm font-semibold text-black">Prefer to talk?</p>
                <a href="tel:0431703770" className="mt-2 flex items-center gap-2 text-black font-medium">
                  <FaPhoneAlt className="w-3.5 h-3.5" />
                  0431 703 770
                </a>
                <p className="text-xs text-gray-500">Mon-Sat, 7am-5pm</p>
                <p className="mt-3 text-xs text-gray-500">
                  Measure bookings run on Mon-Sat, 7am-5pm — you'll get SMS and email confirmation
                  automatically.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export default RequestQuotePage;
