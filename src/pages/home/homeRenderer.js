import { createAdCard } from "../../utils/adCard.js";
import { getSavedAds, INITIAL_SHOW_COUNT } from "./homeState.js";

export function renderAdsContainer(content) {
  const container = document.getElementById("ads-container");
  if (container) container.innerHTML = content;
}

export function renderNoResults(query = "") {
  return `
    <div class="no-results">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <h3>Зар олдсонгүй</h3>
      <p>${query ? `"${query}" гэсэн хайлтаар зар олдсонгүй.` : "Таны шүүлтүүрт тохирох зар байхгүй байна."}</p>
      <button class="btn btn--ghost clear-filter-btn" onclick="document.querySelector('filter-sidebar button[data-action=clear]')?.click()">
        Шүүлтүүрийг арилгах
      </button>
    </div>
  `;
}

export function renderSearchResults(ads, query) {
  const savedAds = getSavedAds();
  return `
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">"${query}" хайлтын үр дүн</h2>
        <span class="group-count">${ads.length} зар</span>
      </div>
      <section class="cards" aria-label="Хайлтын үр дүн">
        ${ads.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
      </section>
    </section>
  `;
}

export function renderFilteredView(ads, statusText) {
  const savedAds = getSavedAds();
  return `
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${statusText} эд зүйлс</h2>
        <span class="group-count">${ads.length} зар</span>
      </div>
      <section class="cards" aria-label="${statusText} зарууд">
        ${ads.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
      </section>
    </section>
  `;
}

export function renderDefaultView(ads) {
  const urgent = ads.filter((ad) => ad.category === "urgent");
  const recent = ads.filter((ad) => ad.category === "recent");

  let html = renderGroup("urgent", "Яаралтай", urgent);
  html += renderGroup("recent", "Сүүлд нэмэгдсэн", recent);

  return html;
}

export function renderGroup(id, title, ads) {
  if (ads.length === 0) return "";

  const savedAds = getSavedAds();
  const hasMore = ads.length > INITIAL_SHOW_COUNT;
  const visibleAds = ads.slice(0, INITIAL_SHOW_COUNT);
  const hiddenAds = ads.slice(INITIAL_SHOW_COUNT);
  const remainingCount = hiddenAds.length;

  return `
    <section class="group" aria-labelledby="${id}-title" data-group="${id}">
      <div class="group-header">
        <h2 id="${id}-title" class="group-title">${title}</h2>
        ${hasMore ? `<span class="group-count">${ads.length} зар</span>` : ""}
      </div>
      <section class="cards" aria-label="${title} зарууд">
        ${visibleAds.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
      </section>
      ${
        hasMore
          ? `
        <div class="hidden-cards" data-group="${id}" style="display: none;">
          <section class="cards">
            ${hiddenAds.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
          </section>
        </div>
        <button class="show-more-btn" data-group="${id}" data-count="${remainingCount}">
          <span class="show-more-text">Бүгдийг харах</span>
          <span class="show-more-count">(+${remainingCount})</span>
          <svg class="show-more-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      `
          : ""
      }
    </section>
  `;
}

export function renderSortedView(sortedAds) {
  const savedAds = getSavedAds();
  return `
    <section class="group">
      <section class="cards" aria-label="Бүх зарууд">
        ${sortedAds.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
      </section>
    </section>
  `;
}

export function renderAllAdsView(ads) {
  const savedAds = getSavedAds();
  return `
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">Бүх зар</h2>
        <span class="group-count">${ads.length} зар</span>
      </div>
      <section class="cards" aria-label="Бүх зарууд">
        ${ads.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
      </section>
    </section>
  `;
}
