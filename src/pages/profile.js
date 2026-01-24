import { adsData } from '../data/ads.js';

export function ProfilePage() {
    const myAds = adsData.slice(0, 4); // Mock active ads
    const archivedAds = adsData.slice(4, 6); // Mock archived ads

    const html = `
    <main-header></main-header>
    <article class="profile-page container">
        <div class="profile-layout">
            <aside class="profile-sidebar">
                <section class="profile-card" aria-label="Хэрэглэгчийн мэдээлэл">
                    <img src="images/avatar_placeholder.png" alt="Profile" class="profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=Bat+Erdene&background=18a861&color=fff'">
                    <h1 class="profile-name">Бат-Эрдэнэ</h1>
                    <p class="profile-email">bat.erdene@example.com</p>
                    
                    <dl class="profile-stats">
                        <div class="stat-item">
                            <dd class="stat-value">12</dd>
                            <dt class="stat-label">Нийт зар</dt>
                        </div>
                        <div class="stat-item">
                            <dd class="stat-value">8</dd>
                            <dt class="stat-label">Олсон</dt>
                        </div>
                        <div class="stat-item">
                            <dd class="stat-value">4</dd>
                            <dt class="stat-label">Идэвхтэй</dt>
                        </div>
                    </dl>

                    <nav class="profile-actions" aria-label="Хэрэглэгчийн цэс">
                        <button class="btn outline-btn full-width">Профайл засах</button>
                        <button class="btn outline-btn full-width icon-btn">
                            <i class="icon-notification"></i> Мэдэгдэл
                        </button>
                        <button class="btn outline-btn full-width icon-btn">
                            <i class="icon-settings"></i> Тохиргоо
                        </button>
                        <button class="btn outline-btn full-width icon-btn logout-btn">
                            <i class="icon-logout"></i> Гарах
                        </button>
                    </nav>
                </section>
            </aside>

            <section class="profile-content" aria-label="Зарын жагсаалт">
                <nav class="profile-tabs" aria-label="Төлөв">
                    <button class="tab-btn active" data-tab="active">Идэвхтэй зарууд</button>
                    <button class="tab-btn" data-tab="archived">Олдсон зарууд</button>
                    <button class="tab-btn" data-tab="saved">Хадгалсан</button>
                </nav>

                <section id="active-ads" class="tab-content" role="tabpanel">
                    <div class="cards">
                        ${myAds.map(ad => createAdCard(ad)).join('')}
                    </div>
                </section>

                <section id="archived-ads" class="tab-content" role="tabpanel" style="display: none;">
                    <div class="cards">
                        ${archivedAds.map(ad => createAdCard(ad)).join('')}
                    </div>
                </section>

                <section id="saved-ads" class="tab-content" role="tabpanel" style="display: none;">
                    <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--muted);">
                        <p>Хадгалсан зар байхгүй байна.</p>
                    </div>
                </section>
            </section>
        </div>
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