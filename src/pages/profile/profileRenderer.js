export function renderAdsSection() {
  return `
        <nav class="profile-tabs" aria-label="Төлөв">
            <button class="tab-btn active" data-tab="active">Миний зарууд</button>
            <button class="tab-btn" data-tab="saved">Хадгалсан</button>
        </nav>

        <section id="active-ads" class="tab-content" role="tabpanel">
            <div id="my-ads-container">
                <div class="loading" style="text-align: center; padding: 2rem;">
                    <p>Уншиж байна...</p>
                </div>
            </div>
        </section>

        <section id="saved-ads" class="tab-content" role="tabpanel" style="display: none;">
            <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--muted);">
                <p>Хадгалсан зар байхгүй байна.</p>
            </div>
        </section>
    `;
}

export function renderNotificationsSection() {
  return `
        <header style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
             <h2 style="margin: 0; font-size: 1.25rem;">Мэдэгдлүүд</h2>
        </header>
        <div id="notifications-container">
            <div class="loading" style="text-align: center; padding: 2rem;">
                <p>Уншиж байна...</p>
            </div>
        </div>
    `;
}
