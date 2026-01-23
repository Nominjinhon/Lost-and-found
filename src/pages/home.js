import { adsData } from '../data/ads.js';

export function HomePage() {
  const html = `
    <main-header></main-header>

    <div class="container">
    <main-search></main-search>

    <header class="hero-row" aria-labelledby="all-ads">
      <h1 id="all-ads" class="page-title">Бүх зар</h1>
      <aside class="status-inline" aria-hidden="false">
        <span class="status"><span class="dot red"></span> Хайж байна</span>
        <span class="status"><span class="dot green"></span> Олсон</span>
      </aside>
    </header>

    <section class="home-layout" aria-label="Ads and filters">
      <filter-sidebar class="home-layout__sidebar"></filter-sidebar>

      <section id="ads-container" class="home-layout__content">
        ${renderDefaultView()}
      </section>
    </section>

    <main-footer></main-footer>
    </div>
  `;


  setTimeout(() => {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', handleSortChange);
    }
  }, 0);

  return html;
}

function renderDefaultView() {
  const urgent = adsData.filter(ad => ad.category === 'urgent');
  const recent = adsData.filter(ad => ad.category === 'recent');
  const phones = adsData.filter(ad => ad.category === 'phones');

  return `
    <section class="group" aria-labelledby="urgent-title">
      <h2 id="urgent-title" class="group-title">Яаралтай</h2>
      <section class="cards" aria-label="Яаралтай зарууд">
        ${urgent.map(ad => createAdCard(ad)).join('')}
      </section>
    </section>

    <section class="group" aria-labelledby="recent-title">
      <h2 id="recent-title" class="group-title">Сүүлд нэмэгдсэн</h2>
      <section class="cards" aria-label="Сүүлд нэмэгдсэн зар">
        ${recent.map(ad => createAdCard(ad)).join('')}
      </section>
    </section>

    <section class="group" aria-labelledby="phones-title">
      <h2 id="phones-title" class="group-title">Удаж буй</h2>
      <section class="cards" aria-label="Гар утас зар">
        ${phones.map(ad => createAdCard(ad)).join('')}
      </section>
    </section>
  `;
}

function renderSortedView(sortedAds) {
  return `
    <section class="group">
      <section class="cards" aria-label="Бүх зарууд">
        ${sortedAds.map(ad => createAdCard(ad)).join('')}
      </section>
    </section>
  `;
}

function createAdCard(ad) {
  return `<ad-card 
    id="${ad.id}" 
    title="${ad.title}" 
    image="${ad.image}" 
    alt="${ad.title}" 
    date="${ad.dateDisplay}" 
    location="${ad.location}" 
    status="${ad.status}">
  </ad-card>`;
}

function handleSortChange(e) {
  const sortValue = e.target.value;
  const container = document.getElementById('ads-container');

  if (!container) return;

  if (sortValue === 'default') {
    container.innerHTML = renderDefaultView();
  } else {
    let sortedAds = [...adsData];

    if (sortValue === 'alphabet') {
      sortedAds.sort((a, b) => a.title.localeCompare(b.title, 'mn'));
    } else if (sortValue === 'date') {
      sortedAds.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    container.innerHTML = renderSortedView(sortedAds);
  }
}



