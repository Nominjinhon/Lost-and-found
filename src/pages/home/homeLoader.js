import { api } from "../../api.js";
import {
  setAllAds,
  setSavedAds,
  setCurrentFilter,
  getAllAds,
} from "./homeState.js";
import {
  renderAdsContainer,
  renderDefaultView,
  renderAllAdsView,
} from "./homeRenderer.js";
import { checkAndRenderDefault, searchAds } from "./homeFilters.js";
import {
  attachShowMoreListeners,
  handleSortChange,
} from "./homeEventHandlers.js";

export async function loadAds() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const token = JSON.parse(userStr).token;
        const user = await api.getMe(token);
        const savedAdsData = (user.savedAds || []).map((ad) =>
          typeof ad === "object" ? ad._id : ad,
        );
        setSavedAds(savedAdsData);
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    }

    const ads = await api.getAds();
    setAllAds(ads);
    renderAdsContainer(renderDefaultView(ads));
    attachShowMoreListeners();
  } catch (error) {
    console.error(error);
    const container = document.getElementById("ads-container");
    if (container)
      container.innerHTML = `<p class="error">Алдаа гарлаа: ${error.message}</p>`;
  }
}

export function initHomePageEvents() {
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
        setCurrentFilter(e.detail);
        checkAndRenderDefault();
      }
    });
  }

  document.addEventListener("showAllAds", () => {
    renderAdsContainer(renderAllAdsView(getAllAds()));
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
