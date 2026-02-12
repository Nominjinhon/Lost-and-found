import { apiFetch, createAuthHeaders, createJsonHeaders } from "./config.js";

/**
 * Register a new user
 */
export async function register(userData) {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: createJsonHeaders(),
    body: JSON.stringify(userData),
  });
}

/**
 * Login user
 */
export async function login(credentials) {
  return apiFetch("/auth/login", {
    method: "POST",
    headers: createJsonHeaders(),
    body: JSON.stringify(credentials),
  });
}

/**
 * Get current user info
 */
export async function getMe(token) {
  return apiFetch("/auth/me", {
    headers: createAuthHeaders(token),
  });
}

/**
 * Toggle bookmark for an ad
 */
export async function toggleBookmark(adId, token) {
  return apiFetch(`/auth/bookmark/${adId}`, {
    method: "PUT",
    headers: createAuthHeaders(token),
  });
}
