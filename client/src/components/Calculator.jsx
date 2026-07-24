import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import PageBanner from "./PageBanner";
import ArrowIcon from "./ArrowIcon";
import Seo from "./Seo";

function Toggle({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-full bg-[#F3EFE9] p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            "px-4 py-1.5 text-sm font-medium rounded-full transition-colors " +
            (value === option ? "bg-black text-white" : "text-gray-600")
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function QuoteCta() {
  return (
    <a
      href="/request-a-quote"
      className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors"
    >
      Get A Free Quote
      <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
        <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </a>
  );
}

function Calculator({ config, serviceType, path }) {
  const navigate = useNavigate();
  const allOptions = config.categories.flatMap((c) => c.options);

  const [installMode, setInstallMode] = useState("Supply & Install");
  const [activeTab, setActiveTab] = useState("Fencing");
  const [selectedOption, setSelectedOption] = useState(allOptions[0]);
  const [style, setStyle] = useState(config.styleOptions[0]);
  const [height, setHeight] = useState(
    config.heightOptions[Math.floor(config.heightOptions.length / 2)] ?? config.heightOptions[0]
  );
  const [thirdChoice, setThirdChoice] = useState(config.thirdDropdownOptions[0]);
  const [length, setLength] = useState(config.defaultLength);
  const [sloping, setSloping] = useState("No");
  const [access, setAccess] = useState("Clear");
  const [removeExisting, setRemoveExisting] = useState("No");
  const [items, setItems] = useState([]);

  const estimate = useMemo(() => {
    let perMetre = selectedOption.pricePerMetre;
    if (installMode === "Supply only") perMetre *= 0.45;

    const heightIndex = config.heightOptions.indexOf(height);
    const heightMid = Math.floor(config.heightOptions.length / 2);
    perMetre *= 1 + (heightIndex - heightMid) * 0.08;

    if (sloping === "Yes") perMetre *= 1.15;
    if (access === "Tight") perMetre *= 1.1;

    const flat = removeExisting === "Yes" ? length * 8 : 0;
    const base = perMetre * length + flat;
    const low = Math.round((base * 0.92) / 10) * 10;
    const high = Math.round((base * 1.08) / 10) * 10;
    return { low, high, perMetre };
  }, [selectedOption, installMode, height, sloping, access, removeExisting, length, config.heightOptions]);

  const addToEstimate = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: selectedOption.name,
        detail: `${length}m · ${height}`,
        length,
        low: estimate.low,
        high: estimate.high,
      },
    ]);
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const totalLow = items.reduce((sum, i) => sum + i.low, 0);
  const totalHigh = items.reduce((sum, i) => sum + i.high, 0);
  const totalLength = items.reduce((sum, i) => sum + i.length, 0);

  const goToQuote = () => {
    const hasItems = items.length > 0;
    const label = config.title.replace(" Calculator", "");
    const detail = hasItems
      ? items.map((i) => `${i.length}m ${i.name}`).join(", ")
      : `${length}m ${height} ${selectedOption.name}`;

    navigate("/request-a-quote", {
      state: {
        calculatorEstimate: {
          label,
          detail,
          low: hasItems ? totalLow : estimate.low,
          high: hasItems ? totalHigh : estimate.high,
          serviceType,
          approxLength: `${hasItems ? totalLength : length} m`,
        },
      },
    });
  };

  return (
    <Layout transparentHeader>
      <Seo
        title={config.title}
        description={config.headingSubtitle || config.subtitle}
        path={path}
      />
      <PageBanner breadcrumb={config.breadcrumb} title={config.title} subtitle={config.subtitle}>
        <QuoteCta />
        <QuoteCta />
      </PageBanner>

      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-black">{config.heading}</h1>
              <p className="mt-2 text-gray-600 max-w-xl">{config.headingSubtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 shrink-0">
              ⚡ Instant estimate · incl. Tax
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-gray-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs font-semibold tracking-wide text-black">PRICING</p>
                <Toggle
                  options={["Supply & Install", "Supply only"]}
                  value={installMode}
                  onChange={setInstallMode}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Fencing", "Gates", "Extras"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={
                      "py-2 rounded-md text-sm font-medium transition-colors " +
                      (activeTab === tab ? "bg-black text-white" : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab !== "Fencing" ? (
                <p className="mt-6 text-sm text-gray-500">
                  {activeTab} options coming soon — talk to us for a custom quote.
                </p>
              ) : (
                <>
                  <p className="mt-6 text-xs font-semibold tracking-wide text-black">{config.chooseLabel}</p>

                  <div className="mt-3 space-y-5">
                    {config.categories.map((cat) => (
                      <div key={cat.category + cat.subtitle}>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium text-gray-700">{cat.category}</span> · {cat.subtitle}
                        </p>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {cat.options.map((option, i) => {
                            const isSelected =
                              selectedOption.name === option.name &&
                              selectedOption.pricePerMetre === option.pricePerMetre;
                            return (
                              <button
                                key={option.name + i}
                                type="button"
                                onClick={() => {
                                  setSelectedOption(option);
                                  if (config.styleOptions.includes(option.name)) setStyle(option.name);
                                }}
                                className={
                                  "text-left rounded-md px-3 py-3 transition-colors " +
                                  (isSelected ? "bg-black text-white" : "bg-[#F3EFE9] text-black hover:bg-gray-200")
                                }
                              >
                                <span className="text-lg">▤</span>
                                <p className="mt-1 text-sm font-semibold">{option.name}</p>
                                <p className={"text-xs " + (isSelected ? "text-gray-300" : "text-gray-500")}>
                                  {option.description}
                                </p>
                                <p
                                  className={
                                    "text-xs font-medium " + (isSelected ? "text-orange-300" : "text-brand-orange")
                                  }
                                >
                                  from ${option.pricePerMetre}/m
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                <p className="text-xs font-semibold tracking-wide text-black">2. CONFIGURE</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                    Style / profile
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="bg-transparent text-sm text-gray-800 focus:outline-none"
                    >
                      {config.styleOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-gray-500">
                    Height
                    <select
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-transparent text-sm text-gray-800 focus:outline-none"
                    >
                      {config.heightOptions.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-3 flex flex-col gap-1 bg-[#F3EFE9] rounded-md px-4 py-3 text-xs font-medium text-brand-orange">
                  {config.thirdDropdownLabel}
                  <select
                    value={thirdChoice}
                    onChange={(e) => setThirdChoice(e.target.value)}
                    className="bg-transparent text-sm text-gray-800 focus:outline-none"
                  >
                    {config.thirdDropdownOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500">{config.lengthUnitLabel}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={config.maxLength}
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="flex-1 accent-black"
                    />
                    <span className="w-20 shrink-0 bg-[#F3EFE9] rounded-md px-3 py-1.5 text-sm text-center text-black">
                      {length} m
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                <p className="text-xs font-semibold tracking-wide text-black">3. SITE DETAILS</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-black">Sloping, uneven or hard ground?</p>
                      <p className="text-xs text-gray-500">Stepped panels and extra digging add cost.</p>
                    </div>
                    <Toggle options={["No", "Yes"]} value={sloping} onChange={setSloping} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-black">Fence line clear, or tight & overgrown?</p>
                      <p className="text-xs text-gray-500">Tight access slows install and clearing.</p>
                    </div>
                    <Toggle options={["Clear", "Tight"]} value={access} onChange={setAccess} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-black">Remove an existing fence?</p>
                      <p className="text-xs text-gray-500">We take away and dispose of the old fence.</p>
                    </div>
                    <Toggle options={["No", "Yes"]} value={removeExisting} onChange={setRemoveExisting} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-500">THIS RUN, ESTIMATED</p>
                  <p className="mt-1 text-2xl font-semibold text-black">
                    ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${estimate.perMetre.toFixed(0)}/m installed × {length}m · {height}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addToEstimate}
                  className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium pl-4 pr-1.5 py-1.5 rounded-full transition-colors shrink-0"
                >
                  Add to estimate
                  <span className="w-7 h-7 rounded-full bg-white text-gray-900 flex items-center justify-center">
                    <ArrowIcon className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </button>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-5 lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-black">Your estimate</p>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setItems([])}
                      className="text-xs text-gray-500 hover:text-black"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">Add a run to start building your estimate.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-2 bg-[#F3EFE9] rounded-md px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-black">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.detail}</p>
                          <p className="text-xs text-gray-700">
                            ${item.low.toLocaleString()}-${item.high.toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove"
                          className="text-gray-400 hover:text-black"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 pt-5 border-t border-gray-200">
                  <p className="text-xs font-semibold tracking-wide text-gray-500">
                    ESTIMATED INVESTMENT · INCL. TAX
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-black">
                    ${(items.length ? totalLow : estimate.low).toLocaleString()} - $
                    {(items.length ? totalHigh : estimate.high).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {items.length || 1} {items.length === 1 || items.length === 0 ? "item" : "items"} · final
                    price confirmed at a free onsite measure
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToQuote}
                  className="mt-4 w-full text-center bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors"
                >
                  Request my exact quote →
                </button>

                <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
                  Estimate only — based on a typical Perth-metro installation. Your final price depends on
                  site access, ground conditions, levels, removal and measured lengths. Prices include GST.
                  This is not a contract or formal offer.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Calculator;
