export function TextField({ label, value, onChange, placeholder, required, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
      />
    </label>
  );
}

export function NumberField({ label, value, onChange, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="mt-1 w-full bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
      />
    </label>
  );
}

export function TextAreaField({ label, value, onChange, rows = 3, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full bg-[#F3EFE9] rounded-md px-3 py-2 text-sm resize-none focus:outline-none"
      />
    </label>
  );
}

export function CheckboxField({ label, checked, onChange, className = "" }) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export function SelectField({ label, value, onChange, options, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StringListField({ label, values, onChange, placeholder }) {
  const list = values || [];
  const setAt = (i, v) => onChange(list.map((item, idx) => (idx === i ? v : item)));
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, ""]);

  return (
    <div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="mt-1 space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => setAt(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="w-8 h-8 shrink-0 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-xs font-medium text-black underline underline-offset-2"
        >
          + Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

export function AdminButton({ children, variant = "primary", ...props }) {
  const base = "text-sm font-medium px-4 py-2 rounded-full transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-black hover:bg-gray-800 text-white",
    secondary: "border border-gray-300 hover:bg-gray-100 text-gray-900",
    danger: "border border-red-200 text-red-600 hover:bg-red-50",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
