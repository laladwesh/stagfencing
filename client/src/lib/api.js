const API_BASE = "/api";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function getCategories() {
  return request("/categories");
}

export function getCategory(slug) {
  return request(`/categories/${slug}`);
}

export function getProducts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ).toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export function getProduct(slug) {
  return request(`/products/${slug}`);
}

export function submitReview(slug, payload) {
  return request(`/products/${slug}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
