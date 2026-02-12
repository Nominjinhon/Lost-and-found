import { icon } from "./icons.js";

class MainSearch extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="search-row">
        <button class="all-ads-btn" type="button" id="all-ads-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Бүх зар</span>
        </button>
        <form class="search-main" role="search" aria-label="Хайлт хийх">
          <input id="search-input" type="search" placeholder="Хайх зүйлээ оруулна уу..." />
          <button type="submit" aria-label="Хайх">
            ${icon("search", 18)}
          </button>
        </form>
      </div>
    `;

    const allAdsBtn = this.querySelector("#all-ads-btn");
    if (allAdsBtn) {
      allAdsBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("showAllAds", { bubbles: true }));
      });
    }
  }
}

window.customElements.define("main-search", MainSearch);
