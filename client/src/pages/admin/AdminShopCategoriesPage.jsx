import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { TextField, NumberField, AdminButton } from "../../components/admin/AdminFormFields";
import {
  getShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory,
} from "../../lib/adminApi";

const EMPTY = { name: "", slug: "", description: "", image: "", parentSlug: "", sortOrder: 0 };

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
      const payload = { ...form, parentSlug: form.parentSlug || null };
      const saved = initial?._id
        ? (await updateShopCategory(initial._id, payload)).category
        : (await createShopCategory(payload)).category;
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
        <TextField label="Parent slug (optional, for subcategories)" value={form.parentSlug} onChange={set("parentSlug")} />
        <NumberField label="Sort order" value={form.sortOrder} onChange={set("sortOrder")} />
      </div>
      <TextField label="Description" value={form.description} onChange={set("description")} />
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

function AdminShopCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | category object
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getShopCategories()
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
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await deleteShopCategory(category._id);
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">Shop categories</h1>
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
                    {category.parentSlug && (
                      <span className="ml-2 text-xs text-gray-400">under {category.parentSlug}</span>
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

export default AdminShopCategoriesPage;
