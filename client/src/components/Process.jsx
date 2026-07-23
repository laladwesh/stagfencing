const STEPS = [
  {
    icon: "📏",
    title: "Free measure and quote",
    description:
      "We come out, measure up, and give you a clear price the same day. No obligation to go ahead.",
  },
  {
    icon: "🎨",
    title: "Pick your style",
    description:
      "We help you settle on the material, height and colour that suit the place and the budget.",
  },
  {
    icon: "🔧",
    title: "We build it",
    description: "Our crew installs it properly and cleans up after — usually done in a day or two.",
  },
  {
    icon: "📋",
    title: "Walk it with us",
    description:
      "We check the finished fence with you before we leave, so anything you're not happy with gets sorted on the spot.",
  },
];

function Process() {
  return (
    <section className="bg-brand-dark py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            PROCESS
          </span>

          <h2 className="mt-5 text-4xl sm:text-5xl font-semibold text-white leading-tight">
            From first call to last panel
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-3xl">
                {step.icon}
                {step.badge && (
                  <span className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-green-500 border-2 border-brand-dark flex items-center justify-center text-xs">
                    {step.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-[220px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
