import { api } from "../api.js";
import { createAdCard } from "../utils/adCard.js";

const INITIAL_SHOW_COUNT = 4;

let currentFilter = {
  type: "lost",
  location: "Улаанбаатар",
  categories: [],
  startDate: null,
  endDate: null,
};

let allAds = [];

export function HomePage() {
  const html = `
    <main-header></main-header>

    <div class="container">
    <main-search></main-search>

    <header class="hero-row" aria-labelledby="all-ads">
      <button type="button" class="filter-toggle-btn" id="filter-toggle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
        </svg>
        Шүүлтүүр
      </button>

      <aside class="status-inline" aria-hidden="false">
        <span class="status"><span class="dot red"></span> Гээсэн</span>
        <span class="status"><span class="dot green"></span> Олсон</span>
      </aside>
    </header>

    <section class="home-layout" aria-label="Ads and filters">
      <filter-sidebar class="home-layout__sidebar"></filter-sidebar>

      <section id="ads-container" class="home-layout__content">
        <div class="loading" style="text-align: center; padding: 2rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <p>Ачаалж байна...</p>
        </div>
      </section>
    </section>

    <main-footer></main-footer>
    </div>
    <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
  `;

  setTimeout(() => {
    initHomePageEvents();
    loadAds();
  }, 0);

  return html;
}

let savedAds = [];

async function loadAds() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const token = JSON.parse(userStr).token;
        const user = await api.getMe(token);
        savedAds = (user.savedAds || []).map((ad) =>
          typeof ad === "object" ? ad._id : ad,
        );
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    }

    allAds = await api.getAds();
    renderAdsContainer(renderDefaultView(allAds));
    attachShowMoreListeners();
  } catch (error) {
    console.error(error);
    const container = document.getElementById("ads-container");
    if (container)
      container.innerHTML = `<p class="error">Алдаа гарлаа: ${error.message}</p>`;
  }
}

function renderAdsContainer(content) {
  const container = document.getElementById("ads-container");
  if (container) container.innerHTML = content;
}

function initHomePageEvents() {
  const sortSelect = document.getElementById("sortSelect");
  const filterSidebar = document.querySelector("filter-sidebar");
  const searchInput = document.querySelector(
    'main-search input[type="search"]',
  );

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => handleSortChange(e));
  }
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value.trim().toLowerCase();
        if (query) {
          searchAds(query);
        } else {
          checkAndRenderDefault();
        }
      }, 300);
    });
  }

  if (filterSidebar) {
    filterSidebar.addEventListener("change", (e) => {
      if (e.detail) {
        currentFilter = e.detail;
        checkAndRenderDefault();
      }
    });
  }

  document.addEventListener("showAllAds", () => {
    renderAdsContainer(renderAllAdsView(allAds));
  });

  const filterToggle = document.getElementById("filter-toggle");
  if (filterToggle) {
    filterToggle.addEventListener("click", () => {
      if (filterSidebar) {
        filterSidebar.classList.toggle("open");
      }
    });
  }
}

function checkAndRenderDefault() {
  const isDefault =
    JSON.stringify(currentFilter) ===
    JSON.stringify({
      type: "lost",
      location: "Улаанбаатар",
      categories: [],
      startDate: null,
      endDate: null,
    });

  if (isDefault) {
    if (allAds.length === 0) {
      loadAds();
    } else {
      renderAdsContainer(renderDefaultView(allAds));
      attachShowMoreListeners();
    }
  } else {
    applyFilters();
  }
}

function attachShowMoreListeners() {
  document.querySelectorAll(".show-more-btn").forEach((btn) => {
    btn.addEventListener("click", handleShowMore);
  });
}

async function applyFilters() {
  const container = document.getElementById("ads-container");
  if (!container) return;

  container.innerHTML = '<div class="loading">Уншиж байна...</div>';

  try {
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
      container.innerHTML = renderFilteredView(finalAds);
    }
  } catch (e) {
    console.error(e);
    container.innerHTML = `<div class="error">Алдаа: ${e.message}</div>`;
  }
}

function searchAds(query) {
  const container = document.getElementById("ads-container");
  if (!container) return;

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

function renderNoResults(query = "") {
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

function renderSearchResults(ads, query) {
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

function renderFilteredView(ads) {
  const statusText = currentFilter.type === "lost" ? "Хаясан" : "Олсон";
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

function renderDefaultView(ads) {
  const urgent = ads.filter((ad) => ad.category === "urgent");
  const recent = ads.filter((ad) => ad.category === "recent");

  let html = renderGroup("urgent", "Яаралтай", urgent);
  html += renderGroup("recent", "Сүүлд нэмэгдсэн", recent);

  return html;
}

function renderGroup(id, title, ads) {
  if (ads.length === 0) return "";

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

function handleShowMore(e) {
  const btn = e.currentTarget;
  const groupId = btn.dataset.group;
  const hiddenCards = document.querySelector(
    `.hidden-cards[data-group="${groupId}"]`,
  );

  if (hiddenCards) {
    const isHidden = hiddenCards.style.display === "none";
    hiddenCards.style.display = isHidden ? "block" : "none";

    const textEl = btn.querySelector(".show-more-text");
    const countEl = btn.querySelector(".show-more-count");
    const iconEl = btn.querySelector(".show-more-icon");

    if (isHidden) {
      textEl.textContent = "Хураах";
      countEl.style.display = "none";
      iconEl.style.transform = "rotate(180deg)";
      btn.classList.add("expanded");
    } else {
      textEl.textContent = "Бүгдийг харах";
      countEl.style.display = "inline";
      iconEl.style.transform = "rotate(0deg)";
      btn.classList.remove("expanded");
    }
  }
}

function renderSortedView(sortedAds) {
  return `
    <section class="group">
      <section class="cards" aria-label="Бүх зарууд">
        ${sortedAds.map((ad) => createAdCard(ad, savedAds.includes(ad._id))).join("")}
      </section>
    </section>
  `;
}

function renderAllAdsView(ads) {
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

function handleSortChange(e) {
  const sortValue = e.target.value;
  const container = document.getElementById("ads-container");

  if (!container) return;

  if (sortValue === "default") {
    renderAdsContainer(renderDefaultView(allAds));
    attachShowMoreListeners();
  } else {
    let sortedAds = [...allAds];

    if (sortValue === "alphabet") {
      sortedAds.sort((a, b) => a.title.localeCompare(b.title, "mn"));
    } else if (sortValue === "date") {
      sortedAds.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderAdsContainer(renderSortedView(sortedAds));
  }
}
