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
  getShopCategories,
  getShopProduct,
  createShopProduct,
  updateShopProduct,
  uploadAdminFile,
} from "../../lib/adminApi";

const EMPTY_PRODUCT = {
  name: "",
  slug: "",
  sku: "",
  category: "",
  subCategorySlug: "",
  shortDescription: "",
  description: "",
  images: [],
  unit: "each",
  basePrice: 0,
  compareAtPrice: "",
  variantGroups: [],
  whatsIncluded: [],
  specifications: [],
  inStock: true,
  featured: false,
  isPinned: false,
  relatedSlugs: [],
};

function ImagesField({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadAdminFile(file);
      onChange([...(images || []), url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <StringListField label="Images" values={images} onChange={onChange} placeholder="https://…" />
      <label className="mt-2 inline-block text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-full px-3 py-1.5 cursor-pointer transition-colors">
        {uploading ? "Uploading…" : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function SpecificationsField({ specifications, onChange }) {
  const list = specifications || [];
  const setAt = (i, key, value) =>
    onChange(list.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, { label: "", value: "" }]);

  return (
    <div>
      <span className="text-xs font-medium text-gray-500">Specifications</span>
      <div className="mt-1 space-y-2">
        {list.map((spec, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={spec.label}
              onChange={(e) => setAt(i, "label", e.target.value)}
              placeholder="Label"
              className="flex-1 min-w-0 bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => setAt(i, "value", e.target.value)}
              placeholder="Value"
              className="flex-1 min-w-0 bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
            />
            <button type="button" onClick={() => removeAt(i)} className="w-8 h-8 shrink-0 text-gray-400 hover:text-red-600">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs font-medium text-black underline underline-offset-2">
          + Add specification
        </button>
      </div>
    </div>
  );
}

function VariantGroupsField({ variantGroups, onChange }) {
  const groups = variantGroups || [];

  const setGroupName = (gi, name) =>
    onChange(groups.map((g, i) => (i === gi ? { ...g, name } : g)));
  const removeGroup = (gi) => onChange(groups.filter((_, i) => i !== gi));
  const addGroup = () => onChange([...groups, { name: "", options: [] }]);

  const setOption = (gi, oi, key, value) =>
    onChange(
      groups.map((g, i) =>
        i === gi ? { ...g, options: g.options.map((o, j) => (j === oi ? { ...o, [key]: value } : o)) } : g
      )
    );
  const removeOption = (gi, oi) =>
    onChange(groups.map((g, i) => (i === gi ? { ...g, options: g.options.filter((_, j) => j !== oi) } : g)));
  const addOption = (gi) =>
    onChange(
      groups.map((g, i) =>
        i === gi
          ? { ...g, options: [...g.options, { label: "", priceModifier: 0, swatch: "", inStock: true, isDefault: false }] }
          : g
      )
    );

  return (
    <div>
      <span className="text-xs font-medium text-gray-500">Variant groups</span>
      <div className="mt-2 space-y-4">
        {groups.map((group, gi) => (
          <div key={gi} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={group.name}
                onChange={(e) => setGroupName(gi, e.target.value)}
                placeholder="Group name (e.g. Colour)"
                className="flex-1 min-w-0 bg-[#F3EFE9] rounded-md px-3 py-2 text-sm font-medium focus:outline-none"
              />
              <button type="button" onClick={() => removeGroup(gi)} className="text-xs font-medium text-red-600">
                Remove group
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {group.options.map((opt, oi) => (
                <div key={oi} className="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => setOption(gi, oi, "label", e.target.value)}
                    placeholder="Label"
                    className="flex-1 min-w-[100px] bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    type="number"
                    value={opt.priceModifier}
                    onChange={(e) => setOption(gi, oi, "priceModifier", Number(e.target.value))}
                    placeholder="+/- price"
                    className="w-24 bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={opt.swatch || ""}
                    onChange={(e) => setOption(gi, oi, "swatch", e.target.value)}
                    placeholder="#hex (optional)"
                    className="w-28 bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:outline-none"
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={opt.inStock}
                      onChange={(e) => setOption(gi, oi, "inStock", e.target.checked)}
                    />
                    In stock
                  </label>
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={opt.isDefault}
                      onChange={(e) => setOption(gi, oi, "isDefault", e.target.checked)}
                    />
                    Default
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOption(gi, oi)}
                    className="text-gray-400 hover:text-red-600 shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(gi)}
                className="text-xs font-medium text-black underline underline-offset-2"
              >
                + Add option
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addGroup} className="text-xs font-medium text-black underline underline-offset-2">
          + Add variant group
        </button>
      </div>
    </div>
  );
}

function AdminShopProductFormPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    getShopCategories().then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (isNew) return;
    getShopProduct(id)
      .then((data) => {
        const p = data.product;
        setForm({
          ...EMPTY_PRODUCT,
          ...p,
          category: p.category?._id || p.category || "",
        });
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
        const { product } = await createShopProduct(form);
        navigate(`/admin/shop/products/${product._id}/edit`);
      } else {
        await updateShopProduct(id, form);
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
      <h1 className="text-2xl font-semibold text-black">{isNew ? "Add product" : "Edit product"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Name*" value={form.name} onChange={set("name")} required />
          <TextField label="Slug*" value={form.slug} onChange={set("slug")} required />
          <TextField label="SKU" value={form.sku} onChange={set("sku")} />
          <SelectField
            label="Category*"
            value={form.category}
            onChange={set("category")}
            options={[{ value: "", label: "Select…" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
          />
          <TextField label="Sub-category slug" value={form.subCategorySlug} onChange={set("subCategorySlug")} />
          <TextField label="Unit" value={form.unit} onChange={set("unit")} placeholder="each / per metre" />
          <NumberField label="Base price*" value={form.basePrice} onChange={set("basePrice")} />
          <NumberField
            label="Compare-at price (optional, shows as a strikethrough discount)"
            value={form.compareAtPrice}
            onChange={set("compareAtPrice")}
          />
        </div>

        <TextField label="Short description" value={form.shortDescription} onChange={set("shortDescription")} />
        <TextAreaField label="Description" value={form.description} onChange={set("description")} rows={4} />

        <div className="flex items-center gap-6">
          <CheckboxField label="In stock" checked={form.inStock} onChange={set("inStock")} />
          <CheckboxField label="Featured" checked={form.featured} onChange={set("featured")} />
          <CheckboxField
            label="Pinned (always shows first in search recommendations)"
            checked={form.isPinned}
            onChange={set("isPinned")}
          />
        </div>

        <ImagesField images={form.images} onChange={set("images")} />
        <StringListField label="What's included" values={form.whatsIncluded} onChange={set("whatsIncluded")} />
        <SpecificationsField specifications={form.specifications} onChange={set("specifications")} />
        <VariantGroupsField variantGroups={form.variantGroups} onChange={set("variantGroups")} />
        <StringListField
          label="Related product slugs"
          values={form.relatedSlugs}
          onChange={set("relatedSlugs")}
          placeholder="product-slug"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save product"}
          </AdminButton>
          <AdminButton type="button" variant="secondary" onClick={() => navigate("/admin/shop/products")}>
            Back to list
          </AdminButton>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminShopProductFormPage;
