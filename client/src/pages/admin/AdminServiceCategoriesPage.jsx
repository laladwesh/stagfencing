import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  TextField,
  TextAreaField,
  NumberField,
  CheckboxField,
  AdminButton,
} from "../../components/admin/AdminFormFields";
import {
  getAdminServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from "../../lib/adminApi";

const EMPTY = {
  name: "",
  slug: "",
  image: "",
  tagline: "",
  fromPrice: 0,
  priceUnit: "",
  sortOrder: 0,
  hasRange: false,
  rangeBannerTitle: "",
  rangeBannerSubtitle: "",
  rangeBannerCta: "",
  rangeIntro: "",
};

function CategoryForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = initial?._id
        ? (await updateServiceCategory(initial._id, form)).category
        : (await createServiceCategory(form)).category;
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField label="Name*" value={form.name} onChange={set("name")} required />
        <TextField label="Slug*" value={form.slug} onChange={set("slug")} required />
        <TextField label="Image URL" value={form.image} onChange={set("image")} />
        <NumberField label="From price" value={form.fromPrice} onChange={set("fromPrice")} />
        <TextField label="Price unit" value={form.priceUnit} onChange={set("priceUnit")} placeholder="per lineal metre" />
        <NumberField label="Sort order" value={form.sortOrder} onChange={set("sortOrder")} />
      </div>
      <TextField label="Tagline (used on the /services grid)" value={form.tagline} onChange={set("tagline")} />

      <CheckboxField
        label="Has a range page (multiple services under this category)"
        checked={form.hasRange}
        onChange={set("hasRange")}
      />

      {form.hasRange && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100 pt-3">
          <TextField label="Range banner title" value={form.rangeBannerTitle} onChange={set("rangeBannerTitle")} />
          <TextField label="Range banner subtitle" value={form.rangeBannerSubtitle} onChange={set("rangeBannerSubtitle")} />
          <TextField label="Range banner CTA text" value={form.rangeBannerCta} onChange={set("rangeBannerCta")} />
          <TextAreaField label="Range intro paragraph" value={form.rangeIntro} onChange={set("rangeIntro")} className="sm:col-span-2" />
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <AdminButton type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}

function AdminServiceCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAdminServiceCategories()
      .then((data) => setCategories(data.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSaved = (saved) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c._id === saved._id);
      return exists ? prev.map((c) => (c._id === saved._id ? saved : c)) : [...prev, saved];
    });
    setEditing(null);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete service category "${category.name}"? This does not delete its services.`)) return;
    try {
      await deleteServiceCategory(category._id);
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">Service categories</h1>
          <p className="mt-1 text-sm text-gray-500">{categories.length} categor{categories.length === 1 ? "y" : "ies"}.</p>
        </div>
        {editing === null && (
          <AdminButton type="button" onClick={() => setEditing("new")}>
            + Add category
          </AdminButton>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {editing === "new" && (
        <div className="mt-6">
          <CategoryForm onSaved={handleSaved} onCancel={() => setEditing(null)} />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {categories.map((category) =>
            editing && editing._id === category._id ? (
              <CategoryForm
                key={category._id}
                initial={category}
                onSaved={handleSaved}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div
                key={category._id}
                className="flex items-center justify-between gap-3 border border-gray-200 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {category.name}
                    {category.hasRange && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">range</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">/{category.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(category)}
                    className="text-xs font-medium text-black underline underline-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="text-xs font-medium text-red-600 underline underline-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminServiceCategoriesPage;
