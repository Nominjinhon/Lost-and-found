import { api } from "../../api.js";
import { createAdCard } from "../../utils/adCard.js";

export async function loadUserAds(token, statsOnly = false) {
  if (!statsOnly) {
    const container = document.getElementById("my-ads-container");
    if (!container) return;
  }

  try {
    const [ads, user] = await Promise.all([
      api.getMyAds(token),
      api.getMe(token),
    ]);

    const statTotal = document.getElementById("stat-total");
    if (statTotal) statTotal.textContent = ads.length;

    const statFound = document.getElementById("stat-found");
    if (statFound)
      statFound.textContent = ads.filter((a) => a.status === "found").length;

    const statLost = document.getElementById("stat-lost");
    if (statLost)
      statLost.textContent = ads.filter((a) => a.status === "lost").length;

    if (statsOnly) return;

    const container = document.getElementById("my-ads-container");
    if (ads.length === 0) {
      container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem;">
                    <p>Та одоогоор зар оруулаагүй байна.</p>
                    <a href="#add" class="btn btn--primary" style="margin-top: 1rem;">Зар нэмэх</a>
                </div>
            `;
    } else {
      container.innerHTML = `<div class="cards">
                ${ads
                  .map((ad) =>
                    createAdCard(
                      ad,
                      user.savedAds?.some((s) => s._id === ad._id),
                    ),
                  )
                  .join("")}
            </div>`;
    }

    const savedContainer = document.getElementById("saved-ads");
    const savedAds = (user.savedAds || []).filter(
      (ad) => ad && typeof ad === "object" && ad._id,
    );

    if (savedContainer) {
      if (savedAds.length === 0) {
        savedContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--muted);">
                    <p>Хадгалсан зар байхгүй байна.</p>
                </div>
            `;
      } else {
        savedContainer.innerHTML = `<div class="cards">
                ${savedAds.map((ad) => createAdCard(ad, true)).join("")}
            </div>`;
      }
    }
  } catch (e) {
    console.error(e);
    if (!statsOnly) {
      const container = document.getElementById("my-ads-container");
      if (container)
        container.innerHTML = `<p class="error">Алдаа: ${e.message}</p>`;
    }
  }
}
