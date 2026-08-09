import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaPhoneAlt, FaChevronLeft, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import Layout from "../components/Layout";
import PageBanner from "../components/PageBanner";
import ArrowIcon from "../components/ArrowIcon";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import { createQuoteRequest, uploadFile, getServiceCategories } from "../lib/api";
import { SERVICE_CATEGORY_TO_QUOTE_LABEL } from "../lib/serviceQuoteLabels";

const SERVICE_TYPES = [
  "Colorbond",
  "Slat fencing",
  "Pool fencing",
  "Retaining walls",
  "Gates & automation",
  "Security fencing",
  "Blade range",
  "Asbestos removal",
  "PVC fencing",
  "Modular walls",
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

const WIZARD_STEP_TITLES = [
  "What do you need?",
  "About the job",
  "Your details",
  "Book your free measure",
  "Review & submit",
];
const TOTAL_STEPS = WIZARD_STEP_TITLES.length;

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

function Field({ label, value, onChange, type = "text", placeholder, required, textarea, rows = 2, className = "", labelClass = "text-brand-orange" }) {
  return (
    <label className={"flex flex-col gap-1 bg-[#F3EFE9] rounded-sm px-4 py-3 text-xs font-medium " + labelClass + " " + className}>
      {label}
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
      )}
    </label>
  );
}

function PhotoUpload({ photos, onChange }) {
  const inputRef = useRef(null);
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onChange([...photos, ...Array.from(e.target.files || [])].slice(0, 5));
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border border-dashed border-gray-300 rounded-sm py-4 text-center hover:border-gray-400 transition-colors"
      >
        <span className="text-sm font-medium text-black">
          {photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""} added` : "+ Add site photos (up to 5)"}
        </span>
        <p className="text-xs text-gray-500 mt-1">Fence line, corners, slopes — photos help us quote faster.</p>
      </button>
    </div>
  );
}

function ServicePicker({ value, onChange, categories }) {
  const options = categories.length
    ? categories.map((category) => ({
        key: category.slug,
        label: SERVICE_CATEGORY_TO_QUOTE_LABEL[category.slug] || category.name,
        name: category.name,
        icon: category.icon,
        fromPrice: category.fromPrice,
        priceUnit: category.priceUnit,
        hazard: category.slug === "asbestos-fence-removal",
      }))
    : SERVICE_TYPES.map((type) => ({ key: type, label: type, name: type }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = value === option.label;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.label)}
            className={
              "flex items-center gap-3 rounded-sm border px-4 py-3 text-left transition-colors " +
              (isSelected ? "border-black bg-[#F3EFE9]" : "border-gray-200 hover:border-gray-300")
            }
          >
            <span
              className={
                "w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 " +
                (isSelected ? "bg-black border-black" : "border-gray-300")
              }
            >
              {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
            </span>
            <span className="w-9 h-9 rounded-sm bg-[#F3EFE9] flex items-center justify-center shrink-0 overflow-hidden">
              {option.hazard ? (
                <FaExclamationTriangle className="w-4 h-4 text-red-500" />
              ) : option.icon ? (
                <img src={option.icon} alt="" className="max-w-6 max-h-6 w-auto h-auto object-contain" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-300" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-black truncate">{option.name}</span>
              {option.fromPrice && (
                <span className="block text-xs text-gray-500">
                  from ${option.fromPrice} / {option.priceUnit?.replace("per ", "") || "lm"}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SelectionBanner({ title, detail, onRemove }) {
  return (
    <div className="flex items-start justify-between gap-3 border border-brand-orange rounded-sm px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-black">{title}</p>
        <p className="text-xs text-gray-500">{detail}</p>
      </div>
      <button type="button" onClick={onRemove} className="text-xs font-medium text-brand-orange shrink-0">
        Remove
      </button>
    </div>
  );
}

function DayTimePicker({ days, selectedDayIndex, onSelectDay, selectedTime, onSelectTime, noPreference, onToggleNoPreference, monthLabel, mobile }) {
  return (
    <div>
      <p className="text-xs text-gray-500">Pick a window that suits — measures take about 30 minutes · {monthLabel}</p>
      {mobile && <p className="mt-2 text-xs text-gray-400">← swipe for more dates</p>}
      <div
        className={
          mobile
            ? "mt-3 flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-1"
            : "mt-3 grid grid-cols-7 gap-2"
        }
      >
        {days.map((d, i) => {
          const isSunday = d.getDay() === 0;
          const isSelected = i === selectedDayIndex;
          return (
            <button
              key={i}
              type="button"
              disabled={isSunday}
              onClick={() => onSelectDay(i)}
              className={
                (mobile ? "w-14 shrink-0 snap-start " : "") +
                "rounded-sm py-3 text-center transition-colors " +
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
            onClick={() => onSelectTime(slot)}
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
          onChange={(e) => onToggleNoPreference(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
        />
        No preference — call me to arrange a time
      </label>
    </div>
  );
}

function ReviewRow({ title, detail, onEdit }) {
  return (
    <div className="bg-[#F3EFE9] rounded-sm px-4 py-3 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-black">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
      </div>
      <button type="button" onClick={onEdit} className="text-xs font-medium text-brand-orange shrink-0">
        Edit
      </button>
    </div>
  );
}

function RequestQuotePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const calculatorEstimate = location.state?.calculatorEstimate ?? null;
  const serviceSelection = location.state?.serviceSelection ?? null;

  const days = getWeekDays();
  const todayIndex = days.findIndex((d) => d.toDateString() === new Date().toDateString());

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getServiceCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  const [service, setService] = useState(() => {
    if (serviceSelection?.label && SERVICE_TYPES.includes(serviceSelection.label)) return serviceSelection.label;
    if (calculatorEstimate && SERVICE_TYPES.includes(calculatorEstimate.serviceType)) return calculatorEstimate.serviceType;
    return SERVICE_TYPES[0];
  });
  const [propertyType, setPropertyType] = useState("Residential");
  const [approxLength, setApproxLength] = useState(calculatorEstimate?.approxLength ?? "");
  const [timeframe, setTimeframe] = useState("");
  const [estimateAttached, setEstimateAttached] = useState(Boolean(calculatorEstimate));
  const [selectionAttached, setSelectionAttached] = useState(Boolean(serviceSelection));
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex >= 0 ? todayIndex : 2);
  const [selectedTime, setSelectedTime] = useState("9-11am");
  const [noPreference, setNoPreference] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [stateRegion, setStateRegion] = useState("WA");
  const [postcode, setPostcode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");

  const monthLabel = `${MONTH_LABELS[days[0].getMonth()]} ${days[0].getFullYear()}`;
  const selectedDay = days[selectedDayIndex];
  const selectedDayLabel = `${selectedDay.toLocaleDateString("en-AU", { weekday: "long" })} ${selectedDay.getDate()} ${MONTH_LABELS[selectedDay.getMonth()]}`;
  const selectedDayShort = `${selectedDay.toLocaleDateString("en-AU", { weekday: "short" })} ${selectedDay.getDate()} ${MONTH_LABELS[selectedDay.getMonth()]}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      let photoUrls = [];
      if (user && photos.length) {
        photoUrls = await Promise.all(photos.map((file) => uploadFile(file)));
      }

      const { quote } = await createQuoteRequest({
        service,
        propertyType,
        approxLength,
        timeframe,
        notes,
        photos: photoUrls,
        selection: selectionAttached && serviceSelection ? serviceSelection : undefined,
        calculatorEstimate: estimateAttached && calculatorEstimate ? calculatorEstimate : undefined,
        firstName,
        lastName,
        mobile,
        email,
        siteAddress,
        suburb,
        state: stateRegion,
        postcode,
        preferredDate: selectedDay,
        preferredTime: selectedTime,
        noPreference,
      });

      setReference(quote.reference);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong — please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  const canGoNext =
    currentStep === 2
      ? approxLength.trim().length > 0
      : currentStep === 3
      ? [firstName, lastName, mobile, email, siteAddress, suburb, postcode].every((v) => v.trim().length > 0)
      : true;

  const goNext = () => {
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    if (currentStep === 1) {
      navigate(-1);
      return;
    }
    setCurrentStep((s) => Math.max(1, s - 1));
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

            <div className="mt-6 bg-[#F3EFE9] rounded-sm px-6 py-5">
              <p className="font-semibold text-black">
                {selectedDayLabel} · {selectedTime} arrival window
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {service} fence · {propertyType}
                {suburb ? ` · ${suburb}` : ""}
                {approxLength ? ` · approx. ${approxLength}` : ""}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Reference #{reference} · Confirmation email sent
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
    <Layout transparentHeader>
      <Seo
        title="Request A Free Quote"
        description="Tell us about your fencing job and book a free on-site measure — get a price confirmed in writing within 48 hours."
        path="/request-a-quote"
      />

      {/* Mobile step wizard */}
      <div className="sm:hidden bg-white min-h-screen">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-8 h-8 -ml-2 flex items-center justify-center text-black"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-semibold text-black">Request a Quote</p>
          <span className="ml-auto text-xs text-gray-400">
            {currentStep}/{TOTAL_STEPS}
          </span>
        </div>
        <div className="mt-3 px-4 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span key={i} className={"h-1 flex-1 rounded-full " + (i < currentStep ? "bg-black" : "bg-gray-200")} />
          ))}
        </div>

        <form id="quote-wizard-form" onSubmit={handleSubmit} className="px-4 pt-6 pb-28">
          <h1 className="text-2xl font-semibold text-black">{WIZARD_STEP_TITLES[currentStep - 1]}</h1>

          {currentStep === 1 && (
            <div className="mt-5">
              <ServicePicker value={service} onChange={setService} categories={categories} />
              <p className="mt-3 text-xs text-gray-500">Pick the closest match — we'll confirm the details on site.</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {["Residential", "Commercial"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPropertyType(option)}
                    className={
                      "py-2.5 rounded-full text-sm font-medium transition-colors " +
                      (propertyType === option ? "bg-black text-white" : "bg-[#F3EFE9] text-gray-600")
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectionAttached && serviceSelection && (
                <SelectionBanner
                  title={`${serviceSelection.serviceName} selection attached`}
                  detail={
                    [serviceSelection.style, serviceSelection.color].filter(Boolean).join(" · ") +
                    (serviceSelection.price
                      ? ` · from $${serviceSelection.price}${serviceSelection.priceUnit ? " " + serviceSelection.priceUnit : ""}`
                      : "")
                  }
                  onRemove={() => setSelectionAttached(false)}
                />
              )}

              <Field label="Approx. length*" value={approxLength} onChange={(e) => setApproxLength(e.target.value)} required placeholder="24 lm" />
              <Field
                label="Timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="In the next month"
                labelClass="text-gray-500"
              />

              {estimateAttached && calculatorEstimate && (
                <SelectionBanner
                  title={`${calculatorEstimate.label} Calculator estimate attached`}
                  detail={`${calculatorEstimate.detail}, approx. $${calculatorEstimate.low.toLocaleString()}–$${calculatorEstimate.high.toLocaleString()} inc GST`}
                  onRemove={() => setEstimateAttached(false)}
                />
              )}

              <Field
                label="Anything else we should know?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                textarea
                placeholder="Gate codes, dogs on site, access notes, old fence removal..."
              />

              <PhotoUpload photos={photos} onChange={setPhotos} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-5 space-y-3">
              <Field label="First name*" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jane" />
              <Field label="Last name*" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Citizen" />
              <Field label="Mobile*" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="0400 000 000" />
              <Field label="Email*" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@gmail.com" />
              <Field label="Site address*" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} required placeholder="8 Example Street" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Suburb*" value={suburb} onChange={(e) => setSuburb(e.target.value)} required placeholder="Joondalup" />
                <Field label="Postcode*" value={postcode} onChange={(e) => setPostcode(e.target.value)} required placeholder="6027" />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-5">
              <DayTimePicker
                days={days}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={setSelectedDayIndex}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                noPreference={noPreference}
                onToggleNoPreference={setNoPreference}
                monthLabel={monthLabel}
                mobile
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="mt-5 space-y-3">
              <ReviewRow title="Service" detail={`${service} fence · ${propertyType}`} onEdit={() => setCurrentStep(1)} />
              <ReviewRow
                title="The job"
                detail={
                  [approxLength, timeframe].filter(Boolean).join(" · ") +
                  (estimateAttached && calculatorEstimate ? ` · estimate $${calculatorEstimate.low.toLocaleString()} attached` : "") +
                  (selectionAttached && serviceSelection
                    ? ` · ${[serviceSelection.style, serviceSelection.color].filter(Boolean).join(" · ")}`
                    : "")
                }
                onEdit={() => setCurrentStep(2)}
              />
              <ReviewRow
                title="Your details"
                detail={`${firstName} ${lastName} · ${mobile} · ${suburb} ${postcode}`}
                onEdit={() => setCurrentStep(3)}
              />
              <ReviewRow
                title="Measure"
                detail={`${selectedDayShort} · ${noPreference ? "No preference" : `${selectedTime} arrival window`}`}
                onEdit={() => setCurrentStep(4)}
              />

              <label className="flex items-start gap-2.5 text-xs text-gray-600 pt-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black shrink-0"
                />
                I agree to the terms &amp; conditions and understand a free measure confirms the final price.
              </label>
              <p className="text-xs text-gray-400">Free &amp; no obligation · confirmation sent by email.</p>
              {submitError && <p className="text-xs text-red-600">{submitError}</p>}
            </div>
          )}
        </form>

        <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-4">
          <button type="button" onClick={goBack} className="text-sm font-medium text-gray-500 shrink-0">
            Back
          </button>
          {currentStep === TOTAL_STEPS ? (
            <button
              type="submit"
              form="quote-wizard-form"
              disabled={!agreedToTerms || submitting}
              className="flex-1 bg-black disabled:opacity-40 text-white text-sm font-semibold py-3 rounded-full text-center transition-opacity"
            >
              {submitting ? "Sending…" : "Request My Quote"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="flex-1 bg-black disabled:opacity-40 text-white text-sm font-semibold py-3 rounded-full text-center transition-opacity"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <PageBanner
          breadcrumb="Home / Request a Quote"
          title="Request a Quote"
          subtitle="Tell us about the job and book your free on-site measure — price confirmed in writing."
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-xs font-semibold tracking-wide text-black">1. WHAT DO YOU NEED?</h2>
                <div className="mt-3">
                  <ServicePicker value={service} onChange={setService} categories={categories} />
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

                {selectionAttached && serviceSelection && (
                  <div className="mt-3">
                    <SelectionBanner
                      title={`${serviceSelection.serviceName} selection attached`}
                      detail={
                        [serviceSelection.style, serviceSelection.color].filter(Boolean).join(" · ") +
                        (serviceSelection.price
                          ? ` · from $${serviceSelection.price}${serviceSelection.priceUnit ? " " + serviceSelection.priceUnit : ""}`
                          : "")
                      }
                      onRemove={() => setSelectionAttached(false)}
                    />
                  </div>
                )}

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Approx. length*" value={approxLength} onChange={(e) => setApproxLength(e.target.value)} required placeholder="24 lm" />
                  <Field
                    label="Timeframe"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="In the next month"
                    labelClass="text-gray-500"
                  />
                </div>

                {estimateAttached && calculatorEstimate && (
                  <div className="mt-3">
                    <SelectionBanner
                      title={`${calculatorEstimate.label} Calculator estimate attached`}
                      detail={`${calculatorEstimate.detail}, approx. $${calculatorEstimate.low.toLocaleString()}–$${calculatorEstimate.high.toLocaleString()} inc GST`}
                      onRemove={() => setEstimateAttached(false)}
                    />
                  </div>
                )}

                <div className="mt-3">
                  <Field
                    label="Anything else we should know?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    textarea
                    placeholder="Gate codes, dogs on site, access notes, old fence removal..."
                  />
                </div>

                <div className="mt-3">
                  <PhotoUpload photos={photos} onChange={setPhotos} />
                </div>
              </section>

              <section>
                <h2 className="text-xs font-semibold tracking-wide text-black">3. YOUR DETAILS</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="First name*" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jane" />
                  <Field label="Last name*" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Citizen" />
                  <Field label="Mobile*" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="0400 000 000" />
                  <Field label="Email*" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@gmail.com" />
                  <Field
                    label="Site address*"
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    required
                    placeholder="8 Example Street"
                    className="sm:col-span-2"
                  />
                  <Field label="Suburb*" value={suburb} onChange={(e) => setSuburb(e.target.value)} required placeholder="Joondalup" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="State*" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} required placeholder="WA" />
                    <Field label="Postcode*" value={postcode} onChange={(e) => setPostcode(e.target.value)} required placeholder="6027" />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xs font-semibold tracking-wide text-black">4. BOOK YOUR FREE MEASURE</h2>
                <div className="mt-3">
                  <DayTimePicker
                    days={days}
                    selectedDayIndex={selectedDayIndex}
                    onSelectDay={setSelectedDayIndex}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    noPreference={noPreference}
                    onToggleNoPreference={setNoPreference}
                    monthLabel={monthLabel}
                  />
                </div>

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors shrink-0"
                  >
                    {submitting ? "Sending…" : "Request My Quote"}
                    <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                      <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </button>
                  <p className="text-xs text-gray-500">
                    Free & no obligation. We'll call within one business day to confirm your measure booking.
                  </p>
                </div>
                {submitError && <p className="mt-2 text-xs text-red-600">{submitError}</p>}
              </section>
            </form>

            <aside className="lg:col-span-1">
              <div className="bg-[#F3EFE9] rounded-sm p-6 lg:sticky lg:top-24">
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
                    Measure bookings run on Mon-Sat, 7am-5pm — you'll get an email confirmation
                    automatically.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RequestQuotePage;
