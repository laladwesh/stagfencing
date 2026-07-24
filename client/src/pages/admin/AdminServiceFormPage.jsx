import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  TextField,
  TextAreaField,
  NumberField,
  CheckboxField,
  SelectField,
  StringListField,
  AdminButton,
} from "../../components/admin/AdminFormFields";
import {
  getAdminServiceCategories,
  getAdminService,
  createService,
  updateService,
  setServiceStyleIcon,
  uploadAdminFile,
} from "../../lib/adminApi";

const EMPTY_SERVICE = {
  category: "",
  isCategoryRoot: false,
  name: "",
  slug: "",
  cardImage: "",
  fromPrice: 0,
  priceUnit: "",
  heroImage: "",
  breadcrumbLabel: "",
  bannerTitle: "",
  bannerSubtitle: "",
  bannerCta: "",
  title: "",
  description: "",
  trustBadges: [],
  statTiles: [],
  swatchGroupLabel: "",
  swatchNote: "",
  swatches: [],
  stylesLabel: "Styles & pricing",
  styles: [],
  everyInstallIncludes: [],
  popularAddOns: [],
  waRulesTitle: "Built to WA rules — handled for you",
  waRules: [],
  processTitle: "",
  processSteps: [],
  recentJobsTitle: "",
  recentJobs: [],
  reviews: [],
  faqTitle: "",
  faqs: [],
  relatedServices: [],
  areasServiced: [],
};

function RepeatableRows({ label, items, onChange, fields, renderExtra, newItem }) {
  const list = items || [];
  const setAt = (i, key, value) => onChange(list.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, newItem]);

  return (
    <div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="mt-2 space-y-3">
        {list.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <div className="flex flex-wrap items-start gap-2">
              {fields.map((f) => (
                <div key={f.key} className={f.className || "flex-1 min-w-[120px]"}>
                  {f.type === "textarea" ? (
                    <textarea
                      value={item[f.key] ?? ""}
                      onChange={(e) => setAt(i, f.key, e.target.value)}
                      placeholder={f.placeholder}
                      rows={2}
                      className="w-full bg-[#F3EFE9] rounded-md px-2 py-1.5 text-xs resize-none focus:outline-none"
                    />
                  ) : f.type === "number" ? (
                    <input
                      type="number"
                      value={item[f.key] ?? ""}
                      onChange={(e) => setAt(i, f.key, Number(e.target.value))}
                      placeholder={f.placeholder}
                      className="w-full bg-[#F3EFE9] rounded-md px-2 py-1.5 text-xs focus:outline-none"
                    />
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-1 text-xs text-gray-600 pt-1.5">
                      <input
                        type="checkbox"
                        checked={!!item[f.key]}
                        onChange={(e) => setAt(i, f.key, e.target.checked)}
                      />
                      {f.placeholder}
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={item[f.key] ?? ""}
                      onChange={(e) => setAt(i, f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full bg-[#F3EFE9] rounded-md px-2 py-1.5 text-xs focus:outline-none"
                    />
                  )}
                </div>
              ))}
              <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 shrink-0">
                ×
              </button>
            </div>
            {renderExtra && renderExtra(item, i, setAt)}
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs font-medium text-black underline underline-offset-2">
          + Add
        </button>
      </div>
    </div>
  );
}

function StylesField({ serviceId, styles, onChange }) {
  const list = styles || [];
  const setAt = (i, key, value) => onChange(list.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, { name: "", fromPrice: 0, priceUnit: "", popular: false, icon: "" }]);

  const uploadIcon = async (i, file) => {
    const url = await uploadAdminFile(file);
    if (serviceId && list[i]._id) {
      await setServiceStyleIcon(serviceId, list[i]._id, url);
    }
    setAt(i, "icon", url);
  };

  return (
    <div>
      <span className="text-xs font-medium text-gray-500">Styles &amp; pricing</span>
      <div className="mt-2 space-y-3">
        {list.map((style, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <div className="flex flex-wrap items-start gap-2">
              <div className="w-14 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                {style.icon ? (
                  <img src={style.icon} alt="" className="max-h-8 max-w-full object-contain" />
                ) : (
                  <span className="text-[9px] text-gray-400">none</span>
                )}
              </div>
              <input
                type="text"
                value={style.name}
                onChange={(e) => setAt(i, "name", e.target.value)}
                placeholder="Name"
                className="flex-1 min-w-[100px] bg-[#F3EFE9] rounded-md px-2 py-1.5 text-xs focus:outline-none"
              />
              <input
                type="number"
                value={style.fromPrice}
                onChange={(e) => setAt(i, "fromPrice", Number(e.target.value))}
                placeholder="Price"
                className="w-20 bg-[#F3EFE9] rounded-md px-2 py-1.5 text-xs focus:outline-none"
              />
              <input
                type="text"
                value={style.priceUnit}
                onChange={(e) => setAt(i, "priceUnit", e.target.value)}
                placeholder="Unit"
                className="w-28 bg-[#F3EFE9] rounded-md px-2 py-1.5 text-xs focus:outline-none"
              />
              <label className="flex items-center gap-1 text-xs text-gray-600 pt-1.5">
                <input
                  type="checkbox"
                  checked={!!style.popular}
                  onChange={(e) => setAt(i, "popular", e.target.checked)}
                />
                Popular
              </label>
              <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 shrink-0">
                ×
              </button>
            </div>
            <div className="mt-2">
              {serviceId && style._id ? (
                <label className="text-[11px] font-medium text-white bg-black hover:bg-gray-800 rounded-full px-2.5 py-1 cursor-pointer transition-colors">
                  Upload icon
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadIcon(i, e.target.files[0])}
                  />
                </label>
              ) : (
                <p className="text-[11px] text-gray-400">Save the service first to upload icons per style.</p>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs font-medium text-black underline underline-offset-2">
          + Add style
        </button>
      </div>
    </div>
  );
}

function SwatchesField({ swatches, onChange }) {
  const list = swatches || [];
  const setAt = (i, key, value) => onChange(list.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, { label: "", hex: "#888888" }]);

  return (
    <div>
      <span className="text-xs font-medium text-gray-500">Swatches</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {list.map((s, i) => (
          <div key={i} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1.5">
            <input type="color" value={s.hex || "#888888"} onChange={(e) => setAt(i, "hex", e.target.value)} className="w-6 h-6 rounded" />
            <input
              type="text"
              value={s.label}
              onChange={(e) => setAt(i, "label", e.target.value)}
              placeholder="Label"
              className="w-20 bg-white border border-gray-200 rounded-md px-1.5 py-1 text-xs focus:outline-none"
            />
            <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600">
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 text-xs font-medium text-black underline underline-offset-2">
        + Add swatch
      </button>
    </div>
  );
}

function AdminServiceFormPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    getAdminServiceCategories().then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (isNew) return;
    getAdminService(id)
      .then((data) => {
        const s = data.service;
        setForm({ ...EMPTY_SERVICE, ...s, category: s.category?._id || s.category || "" });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        const { service } = await createService(form);
        navigate(`/admin/services/services/${service._id}/edit`);
      } else {
        const { service } = await updateService(id, form);
        setForm({ ...EMPTY_SERVICE, ...service, category: service.category?._id || service.category || "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-sm text-gray-500">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-black">{isNew ? "Add service" : "Edit service"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Category*"
            value={form.category}
            onChange={set("category")}
            options={[{ value: "", label: "Select…" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
          />
          <TextField label="Name*" value={form.name} onChange={set("name")} required />
          <TextField label="Slug*" value={form.slug} onChange={set("slug")} required />
          <NumberField label="From price" value={form.fromPrice} onChange={set("fromPrice")} />
          <TextField label="Price unit" value={form.priceUnit} onChange={set("priceUnit")} placeholder="per lineal metre" />
          <CheckboxField
            label="Is category root (no range page, this IS the category's page)"
            checked={form.isCategoryRoot}
            onChange={set("isCategoryRoot")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Card image URL" value={form.cardImage} onChange={set("cardImage")} />
          <TextField label="Hero image URL" value={form.heroImage} onChange={set("heroImage")} />
          <TextField label="Breadcrumb label" value={form.breadcrumbLabel} onChange={set("breadcrumbLabel")} />
          <TextField label="Banner title" value={form.bannerTitle} onChange={set("bannerTitle")} />
          <TextField label="Banner subtitle" value={form.bannerSubtitle} onChange={set("bannerSubtitle")} />
          <TextField label="Banner CTA text" value={form.bannerCta} onChange={set("bannerCta")} />
        </div>

        <TextField label="Page title (H1)" value={form.title} onChange={set("title")} />
        <TextAreaField label="Description" value={form.description} onChange={set("description")} rows={4} />
        <StringListField label="Trust badges" values={form.trustBadges} onChange={set("trustBadges")} />

        <RepeatableRows
          label="Stat tiles"
          items={form.statTiles}
          onChange={set("statTiles")}
          newItem={{ value: "", label: "" }}
          fields={[
            { key: "value", placeholder: "Value (e.g. 10 yr)" },
            { key: "label", placeholder: "Label" },
          ]}
        />

        <TextField label="Swatch group label" value={form.swatchGroupLabel} onChange={set("swatchGroupLabel")} />
        <TextField label="Swatch note" value={form.swatchNote} onChange={set("swatchNote")} />
        <SwatchesField swatches={form.swatches} onChange={set("swatches")} />

        <TextField label="Styles section label" value={form.stylesLabel} onChange={set("stylesLabel")} />
        <StylesField serviceId={isNew ? null : id} styles={form.styles} onChange={set("styles")} />

        <StringListField label="Every install includes" values={form.everyInstallIncludes} onChange={set("everyInstallIncludes")} />
        <StringListField label="Popular add-ons" values={form.popularAddOns} onChange={set("popularAddOns")} />

        <TextField label="WA rules title" value={form.waRulesTitle} onChange={set("waRulesTitle")} />
        <StringListField label="WA rules" values={form.waRules} onChange={set("waRules")} />

        <TextField label="Process title" value={form.processTitle} onChange={set("processTitle")} />
        <RepeatableRows
          label="Process steps"
          items={form.processSteps}
          onChange={set("processSteps")}
          newItem={{ title: "", description: "" }}
          fields={[
            { key: "title", placeholder: "Step title", className: "w-40" },
            { key: "description", type: "textarea", placeholder: "Step description" },
          ]}
        />

        <TextField label="Recent jobs title" value={form.recentJobsTitle} onChange={set("recentJobsTitle")} />
        <RepeatableRows
          label="Recent jobs"
          items={form.recentJobs}
          onChange={set("recentJobs")}
          newItem={{ image: "", caption: "" }}
          fields={[
            { key: "image", placeholder: "Image URL" },
            { key: "caption", placeholder: "Caption" },
          ]}
        />

        <RepeatableRows
          label="Reviews"
          items={form.reviews}
          onChange={set("reviews")}
          newItem={{ name: "", location: "", rating: 5, comment: "" }}
          fields={[
            { key: "name", placeholder: "Name", className: "w-32" },
            { key: "location", placeholder: "Location, date", className: "w-40" },
            { key: "rating", type: "number", placeholder: "1-5", className: "w-16" },
            { key: "comment", type: "textarea", placeholder: "Comment", className: "w-full basis-full" },
          ]}
        />

        <TextField label="FAQ title" value={form.faqTitle} onChange={set("faqTitle")} />
        <RepeatableRows
          label="FAQs"
          items={form.faqs}
          onChange={set("faqs")}
          newItem={{ question: "", answer: "" }}
          fields={[
            { key: "question", placeholder: "Question", className: "w-full basis-full" },
            { key: "answer", type: "textarea", placeholder: "Answer", className: "w-full basis-full" },
          ]}
        />

        <StringListField label="Related services" values={form.relatedServices} onChange={set("relatedServices")} />
        <StringListField label="Areas serviced" values={form.areasServiced} onChange={set("areasServiced")} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 pb-10">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save service"}
          </AdminButton>
          <AdminButton type="button" variant="secondary" onClick={() => navigate("/admin/services/services")}>
            Back to list
          </AdminButton>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminServiceFormPage;
