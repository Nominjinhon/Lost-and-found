const BASE_URL = "http://localhost:5000/api";

export const api = {
  // Auth
  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }
    return res.json();
  },

  getMe: async (token) => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  toggleBookmark: async (adId, token) => {
    const res = await fetch(`${BASE_URL}/auth/bookmark/${adId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to update bookmark");
    return res.json();
  },

  // Ads
  getAds: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.location) params.append("location", filters.location);
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);

    const res = await fetch(`${BASE_URL}/ads?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch ads");
    return res.json();
  },

  getAd: async (id) => {
    const res = await fetch(`${BASE_URL}/ads/${id}`);
    if (!res.ok) throw new Error("Failed to fetch ad");
    return res.json();
  },

  getMyAds: async (token) => {
    const res = await fetch(`${BASE_URL}/ads/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch my ads");
    return res.json();
  },

  deleteAd: async (id, token) => {
    const res = await fetch(`${BASE_URL}/ads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete ad");
    }
    return res.json();
  },

  createAd: async (formData, token) => {
    const res = await fetch(`${BASE_URL}/ads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type not needed for FormData, browser sets it with boundary
      },
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create ad");
    }
    return res.json();
  },

  // Notifications
  createNotification: async (data, token) => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create notification");
    }
    return res.json();
  },

  getMyNotifications: async (token) => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  markNotificationRead: async (id, token) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to update notification");
    return res.json();
  },

  verifyClaim: async (id, token) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/verify`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to verify claim");
    return res.json();
  },
};
