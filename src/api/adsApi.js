import { apiFetch, createAuthHeaders } from "./config.js";

export async function getAds(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append("type", filters.type);
  if (filters.location) params.append("location", filters.location);
  if (filters.status) params.append("status", filters.status);
  if (filters.category) params.append("category", filters.category);

  const queryString = params.toString();
  const endpoint = queryString ? `/ads?${queryString}` : "/ads";

  return apiFetch(endpoint);
}

export async function getAd(id) {
  return apiFetch(`/ads/${id}`);
}

export async function getMyAds(token) {
  return apiFetch("/ads/user/me", {
    headers: createAuthHeaders(token),
  });
}

export async function deleteAd(id, token) {
  return apiFetch(`/ads/${id}`, {
    method: "DELETE",
    headers: createAuthHeaders(token),
  });
}

export async function createAd(formData, token) {
  return apiFetch("/ads", {
    method: "POST",
    headers: createAuthHeaders(token),
    body: formData,
  });
}
