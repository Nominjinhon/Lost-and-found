import { adsData } from '../data/ads.js';

export function ProfilePage() {
    const myAds = adsData.slice(0, 4); // Mock active ads
    const archivedAds = adsData.slice(4, 6); // Mock archived ads

    const html = `
    <main-header></main-header>
    <article class="profile-page">
        <header class="profile-header container">
            <img src="images/avatar_placeholder.png" alt="Profile" class="profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=Bat+Erdene&background=18a861&color=fff'">
            <div class="profile-info">
                <h1 class="profile-name">Бат-Эрдэнэ</h1>
                <p class="profile-email">bat.erdene@example.com</p>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-value">12</span>
                        <span class="stat-label">Нийт зар</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">8</span>
                        <span class="stat-label">Олсон</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">4</span>
                        <span class="stat-label">Идэвхтэй</span>
                    </div>
                </div>
            </div>
            <button class="btn outline-btn">Профайл засах</button>
        </header>

        <section class="container">
            <div class="profile-tabs">
                <button class="tab-btn active" data-tab="active">Идэвхтэй зарууд</button>
                <button class="tab-btn" data-tab="archived">Архивлагдсан</button>
                <button class="tab-btn" data-tab="saved">Хадгалсан</button>
            </div>

            <div id="active-ads" class="tab-content">
                <div class="cards">
                    ${myAds.map(ad => createAdCard(ad)).join('')}
                </div>
            </div>

            <div id="archived-ads" class="tab-content" style="display: none;">
                <div class="cards">
                    ${archivedAds.map(ad => createAdCard(ad)).join('')}
                </div>
            </div>

            <div id="saved-ads" class="tab-content" style="display: none;">
                <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--muted);">
                    <p>Хадгалсан зар байхгүй байна.</p>
                </div>
            </div>
        </section>
    </article>
    `;

    setTimeout(() => {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');

                // Hide all contents
                contents.forEach(c => c.style.display = 'none');

                // Show target content
                const targetId = tab.dataset.tab + '-ads';
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }, 0);

    return html;
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