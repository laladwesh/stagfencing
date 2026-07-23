const SERVICE_TYPES = ["Fence Installation", "Fence Repair", "Gate & Automation", "Retaining Wall"];

function QuoteForm({ className = "" }) {
  return (
    <form
      className={
        "bg-white rounded-2xl shadow-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-4 gap-3 " +
        className
      }
    >
      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-1 sm:row-start-1">
        Name*
        <input
          type="text"
          required
          className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
        />
      </label>
      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-2 sm:row-start-1">
        Email*
        <input
          type="email"
          required
          className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
        />
      </label>
      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-3 sm:row-start-1">
        Phone No*
        <input
          type="tel"
          required
          className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
        />
      </label>

      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-1 sm:col-span-2 sm:row-start-2">
        Address*
        <input
          type="text"
          required
          className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900"
        />
      </label>
      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-3 sm:row-start-2">
        Type Of Service*
        <select className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900">
          {SERVICE_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-1 sm:col-span-2 sm:row-start-3 sm:row-span-2">
        Message
        <textarea className="flex-1 bg-transparent border-b border-transparent text-sm text-gray-800 resize-none focus:outline-none focus:border-gray-900" />
      </label>
      <label className="flex flex-col gap-1 bg-[#F3EFE9] rounded-md shadow-sm px-5 py-2.5 text-xs font-medium text-gray-500 sm:col-start-3 sm:row-start-3">
        Remove Existing Fence?*
        <select className="bg-transparent border-b border-transparent text-sm text-gray-800 focus:outline-none focus:border-gray-900">
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>
      <div className="flex items-end sm:col-start-3 sm:row-start-4">
        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-full transition-colors"
        >
          Get my free quote
        </button>
      </div>
    </form>
  );
}

export default QuoteForm;
