import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { TextField, NumberField, SelectField, AdminButton } from "../../components/admin/AdminFormFields";
import {
  getAdminGalleryProjects,
  createGalleryProject,
  updateGalleryProject,
  deleteGalleryProject,
  uploadAdminFile,
  getShopProducts,
  getAdminServices,
} from "../../lib/adminApi";

const EMPTY = {
  title: "",
  image: "",
  suburb: "",
  service: "",
  serviceSlug: "",
  productSlug: "",
  colour: "",
  length: "",
  completedDate: "",
  sortOrder: 0,
};

function toDateInputValue(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function ProjectForm({ initial, products, services, onSaved, onCancel }) {
  const [form, setForm] = useState(
    initial ? { ...initial, completedDate: toDateInputValue(initial.completedDate) } : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadAdminFile(file);
      set("image")(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = initial?._id
        ? (await updateGalleryProject(initial._id, form)).project
        : (await createGalleryProject(form)).project;
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-24 h-16 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
          {form.image && <img src={form.image} alt="" className="w-full h-full object-cover" />}
        </div>
        <label className="text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-full px-3 py-1.5 cursor-pointer transition-colors">
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField label="Title*" value={form.title} onChange={set("title")} required />
        <TextField label="Suburb" value={form.suburb} onChange={set("suburb")} />
        <TextField label="Service label (filter tag)" value={form.service} onChange={set("service")} placeholder="Colorbond" />
        <SelectField
          label="Linked service (optional)"
          value={form.serviceSlug}
          onChange={set("serviceSlug")}
          options={[{ value: "", label: "None" }, ...services.map((s) => ({ value: s.slug, label: s.name }))]}
        />
        <SelectField
          label="Linked product (optional)"
          value={form.productSlug}
          onChange={set("productSlug")}
          options={[{ value: "", label: "None" }, ...products.map((p) => ({ value: p.slug, label: p.name }))]}
        />
        <TextField label="Length" value={form.length} onChange={set("length")} placeholder="24 lm" />
        <TextField label="Colour" value={form.colour} onChange={set("colour")} />
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Completed date</span>
          <input
            type="date"
            value={form.completedDate}
            onChange={(e) => set("completedDate")(e.target.value)}
            className="mt-1 w-full bg-[#F3EFE9] rounded-md px-3 py-2 text-sm focus:outline-none"
          />
        </label>
        <NumberField label="Sort order" value={form.sortOrder} onChange={set("sortOrder")} />
      </div>

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

function AdminGalleryPage() {
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getAdminGalleryProjects(), getShopProducts(), getAdminServices()])
      .then(([projectsData, productsData, servicesData]) => {
        setProjects(projectsData.projects);
        setProducts(productsData.products);
        setServices(servicesData.services);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSaved = (saved) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p._id === saved._id);
      return exists ? prev.map((p) => (p._id === saved._id ? saved : p)) : [saved, ...prev];
    });
    setEditing(null);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete gallery project "${project.title}"?`)) return;
    try {
      await deleteGalleryProject(project._id);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">{projects.length} project(s).</p>
        </div>
        {editing === null && (
          <AdminButton type="button" onClick={() => setEditing("new")}>
            + Add project
          </AdminButton>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {editing === "new" && (
        <div className="mt-6">
          <ProjectForm products={products} services={services} onSaved={handleSaved} onCancel={() => setEditing(null)} />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map((project) =>
            editing && editing._id === project._id ? (
              <ProjectForm
                key={project._id}
                initial={project}
                products={products}
                services={services}
                onSaved={handleSaved}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div
                key={project._id}
                className="flex items-center justify-between gap-3 border border-gray-200 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                    {project.image && <img src={project.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{project.title}</p>
                    <p className="text-xs text-gray-500">
                      {project.suburb} · {project.service}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(project)}
                    className="text-xs font-medium text-black underline underline-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
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

export default AdminGalleryPage;
