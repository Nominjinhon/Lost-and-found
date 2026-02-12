import { initHomePageEvents, loadAds } from "./home/homeLoader.js";

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
