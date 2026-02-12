const BASE_URL = "http://localhost:5000/api";

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

export function createAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function createJsonHeaders() {
  return {
    "Content-Type": "application/json",
  };
}
