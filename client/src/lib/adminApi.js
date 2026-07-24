import { getToken } from "./auth";

const API_BASE = "/api/admin";

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

function json(method, path, payload) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Users
export const getUsers = () => request("/users");
export const setUserAdmin = (id, isAdmin) => json("PUT", `/users/${id}/admin`, { isAdmin });

// Shop categories
export const getShopCategories = () => request("/shop/categories");
export const createShopCategory = (payload) => json("POST", "/shop/categories", payload);
export const updateShopCategory = (id, payload) => json("PUT", `/shop/categories/${id}`, payload);
export const deleteShopCategory = (id) => json("DELETE", `/shop/categories/${id}`);

// Shop products
export const getShopProducts = () => request("/shop/products");
export const getShopProduct = (id) => request(`/shop/products/${id}`);
export const createShopProduct = (payload) => json("POST", "/shop/products", payload);
export const updateShopProduct = (id, payload) => json("PUT", `/shop/products/${id}`, payload);
export const deleteShopProduct = (id) => json("DELETE", `/shop/products/${id}`);

// Shop reviews
export const getShopReviews = () => request("/shop/reviews");
export const deleteShopReview = (id) => json("DELETE", `/shop/reviews/${id}`);

// Service categories
export const getAdminServiceCategories = () => request("/services/categories");
export const createServiceCategory = (payload) => json("POST", "/services/categories", payload);
export const updateServiceCategory = (id, payload) => json("PUT", `/services/categories/${id}`, payload);
export const deleteServiceCategory = (id) => json("DELETE", `/services/categories/${id}`);

// Services
export const getAdminServices = () => request("/services/services");
export const getAdminService = (id) => request(`/services/services/${id}`);
export const createService = (payload) => json("POST", "/services/services", payload);
export const updateService = (id, payload) => json("PUT", `/services/services/${id}`, payload);
export const deleteService = (id) => json("DELETE", `/services/services/${id}`);
export const setServiceStyleIcon = (serviceId, styleId, icon) =>
  json("PUT", `/services/services/${serviceId}/styles/${styleId}/icon`, { icon });

// Orders
export const getAdminOrders = () => request("/orders");
export const setOrderStatus = (id, status) => json("PUT", `/orders/${id}/status`, { status });

export async function uploadAdminFile(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("files", file);
  const res = await fetch("/api/uploads", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed: ${res.status}`);
  }
  const data = await res.json();
  return data.files[0];
}
