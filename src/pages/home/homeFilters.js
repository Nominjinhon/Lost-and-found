import { api } from "../../api.js";
import { getCurrentFilter, getAllAds, setCurrentFilter } from "./homeState.js";
import {
  renderAdsContainer,
  renderNoResults,
  renderFilteredView,
  renderDefaultView,
  renderSearchResults,
} from "./homeRenderer.js";
import { attachShowMoreListeners } from "./homeEventHandlers.js";

export async function applyFilters() {
  const container = document.getElementById("ads-container");
  if (!container) return;

  container.innerHTML = '<div class="loading">Уншиж байна...</div>';

  try {
    const currentFilter = getCurrentFilter();
    const apiFilter = {
      status: currentFilter.type,
    };

    if (currentFilter.location && currentFilter.location !== "Улаанбаатар") {
      apiFilter.location = currentFilter.location;
    }

    if (currentFilter.categories && currentFilter.categories.length > 0) {
      apiFilter.category = currentFilter.categories.join(",");
    }

    const filteredAds = await api.getAds(apiFilter);

    let finalAds = filteredAds;
    if (currentFilter.startDate) {
      const startDate = new Date(currentFilter.startDate);
      finalAds = finalAds.filter((ad) => new Date(ad.date) >= startDate);
    }

    if (currentFilter.endDate) {
      const endDate = new Date(currentFilter.endDate);
      finalAds = finalAds.filter((ad) => new Date(ad.date) <= endDate);
    }

    if (finalAds.length === 0) {
      container.innerHTML = renderNoResults();
    } else {
      const statusText = currentFilter.type === "lost" ? "Хаясан" : "Олсон";
      container.innerHTML = renderFilteredView(finalAds, statusText);
    }
  } catch (e) {
    console.error(e);
    container.innerHTML = `<div class="error">Алдаа: ${e.message}</div>`;
  }
}

export function checkAndRenderDefault() {
  applyFilters();
}

export function searchAds(query) {
  const container = document.getElementById("ads-container");
  if (!container) return;

  const allAds = getAllAds();
  const results = allAds.filter(
    (ad) =>
      ad.title.toLowerCase().includes(query) ||
      ad.location.toLowerCase().includes(query) ||
      (ad.description && ad.description.toLowerCase().includes(query)) ||
      (ad.type && ad.type.toLowerCase().includes(query)),
  );

  if (results.length === 0) {
    container.innerHTML = renderNoResults(query);
  } else {
    container.innerHTML = renderSearchResults(results, query);
  }
}
