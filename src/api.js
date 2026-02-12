import * as authApi from "./api/authApi.js";
import * as adsApi from "./api/adsApi.js";
import * as notificationsApi from "./api/notificationsApi.js";

export const api = {
  register: authApi.register,
  login: authApi.login,
  getMe: authApi.getMe,
  toggleBookmark: authApi.toggleBookmark,

  getAds: adsApi.getAds,
  getAd: adsApi.getAd,
  getMyAds: adsApi.getMyAds,
  deleteAd: adsApi.deleteAd,
  createAd: adsApi.createAd,

  createNotification: notificationsApi.createNotification,
  getMyNotifications: notificationsApi.getMyNotifications,
  markNotificationRead: notificationsApi.markNotificationRead,
  verifyClaim: notificationsApi.verifyClaim,
};
