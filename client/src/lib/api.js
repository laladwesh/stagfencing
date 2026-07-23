import { getToken } from "./auth";

const API_BASE = "/api";

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

export function requestOtp(email) {
  return request("/auth/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(email, code) {
  return request("/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
}

export function loginWithGoogle(credential) {
  return request("/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
}

export function getMe() {
  return request("/auth/me");
}

export function getOrders() {
  return request("/orders");
}

export function createOrder(payload) {
  return request("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getCart() {
  return request("/cart");
}

export function saveCart(items) {
  return request("/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
}

export function saveAddress(address) {
  return request("/auth/address", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
}

export function createPaymentIntent(amount) {
  return request("/payments/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
}

export function getServiceCategories() {
  return request("/services/categories");
}

export function getServiceCategory(slug) {
  return request(`/services/categories/${slug}`);
}

export function getServiceDetail(slug) {
  return request(`/services/detail/${slug}`);
}
