import { apiFetch, createAuthHeaders, createJsonHeaders } from "./config.js";

export async function createNotification(data, token) {
  return apiFetch("/notifications", {
    method: "POST",
    headers: {
      ...createJsonHeaders(),
      ...createAuthHeaders(token),
    },
    body: JSON.stringify(data),
  });
}

export async function getMyNotifications(token) {
  return apiFetch("/notifications", {
    headers: createAuthHeaders(token),
  });
}

export async function markNotificationRead(id, token) {
  return apiFetch(`/notifications/${id}/read`, {
    method: "PUT",
    headers: createAuthHeaders(token),
  });
}

export async function verifyClaim(id, token) {
  return apiFetch(`/notifications/${id}/verify`, {
    method: "PUT",
    headers: createAuthHeaders(token),
  });
}

export async function rejectClaim(id, token) {
  return apiFetch(`/notifications/${id}/reject`, {
    method: "PUT",
    headers: createAuthHeaders(token),
  });
}
