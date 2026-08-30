import LazyImage from "./LazyImage";

const FEATURES = [
  {
    icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/why-choose-us/1788031877362-ffa070064dbb7e64.png",
    title: "Quoted today, on site tomorrow",
    description:
      "Call in the morning and you'll usually have your quote by knock-off, with a crew on the tools the next day.",
  },
  {
    icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/why-choose-us/1788031878223-4ad813f8a94d45c9.png",
    title: "A straight price, no surprises",
    description:
      "The quote we hand you is itemised and final. Whatever we agree at the start is what you pay when the job's done.",
  },
  {
    icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/why-choose-us/1788031878449-0c4d36f1f59fd431.png",
    title: "The jobs other fencers pass on",
    description:
      "Old asbestos to pull out, a retaining wall the fence can't go up without. We're licensed for both, done in the right order by one crew.",
  },
  {
    icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/why-choose-us/1788031878676-badfabad513aa782.png",
    title: "We take the old fence with us",
    description:
      "The old panels, offcuts and rubbish leave when we do, so you're not left with a pile in the yard.",
  },
];

const FEATURE_PHOTO = "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/why-choose-us/1788031940793-dc5afda30c0125ba.png";

function WhyChooseUs() {
  return (
    <section className="bg-[#F3EFE9] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            WHY CHOOSE US
          </span>

          <h2 className="mt-5 text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
            We take the whole <br /> job off your hands
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="aspect-square rounded-sm overflow-hidden">
            <LazyImage src={FEATURE_PHOTO} alt="Happy Stag Fencing customer" width={700} className="w-full h-full object-cover" />
          </div>

          <ul className="divide-y divide-gray-300/70">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={feature.icon} alt="" className="w-9 h-9 object-contain shrink-0" />
                  <h3 className="text-xl sm:text-3xl font-semibold text-black0">{feature.title}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
