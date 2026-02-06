import { api } from "../api.js";
import { createAdCard } from "../utils/adCard.js";

export function ProfilePage() {
  // Check session storage override
  let view = "ads";
  const savedView = sessionStorage.getItem("profileView");
  if (savedView) {
    view = savedView;
    sessionStorage.removeItem("profileView");
  }

  // Check if user is logged in
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    window.location.hash = "#login";
    return "";
  }
  const user = JSON.parse(userStr);

  const html = `
    <main-header></main-header>
    <article class="profile-page container">
        <div class="profile-layout">
            <aside class="profile-sidebar">
                <section class="profile-card" aria-label="Хэрэглэгчийн мэдээлэл">
                    <img src="images/avatar_placeholder.png" alt="Profile" class="profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${user.name}&background=18a861&color=fff'">
                    <h1 class="profile-name">${user.name}</h1>
                    <p class="profile-email">${user.phone}</p>
                    
                    <dl class="profile-stats">
                        <div class="stat-item">
                            <dd class="stat-value" id="stat-total">-</dd>
                            <dt class="stat-label">Нийт зар</dt>
                        </div>
                        <div class="stat-item">
                            <dd class="stat-value" id="stat-found">-</dd>
                            <dt class="stat-label">Олсон</dt>
                        </div>
                        <div class="stat-item">
                            <dd class="stat-value" id="stat-lost">-</dd>
                            <dt class="stat-label">Хайж байна</dt>
                        </div>
                    </dl>

                    <nav class="profile-actions" aria-label="Хэрэглэгчийн цэс">
                        <button class="btn outline-btn full-width sidebar-nav-btn ${view === "ads" ? "active" : ""}" data-target="ads">Миний зарууд</button>
                        <button class="btn outline-btn full-width icon-btn sidebar-nav-btn ${view === "notifications" ? "active" : ""}" data-target="notifications">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                             Мэдэгдэл
                        </button>
                        <button class="btn outline-btn full-width icon-btn logout-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                             Гарах
                        </button>
                    </nav>
                </section>
            </aside>

            <section class="profile-content" id="profile-content-area" aria-label="Үндсэн хэсэг">
                ${view === "notifications" ? renderNotificationsSection() : renderAdsSection()}
            </section>
        </div>
    </article>
    <main-footer></main-footer>
    `;

  setTimeout(() => {
    initProfileEvents(view);
    // Always load user ads (for stats and initial view)
    loadUserAds(user.token);
    if (view === "notifications") {
      loadNotifications(user.token);
    }
  }, 0);

  return html;
}

function renderAdsSection() {
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

function renderNotificationsSection() {
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

async function loadNotifications(token) {
  const container = document.getElementById("notifications-container");
  if (!container) return;

  try {
    const notifs = await api.getMyNotifications(token);

    if (notifs.length === 0) {
      container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--muted);">
                    <p>Танд одоогоор мэдэгдэл ирээгүй байна.</p>
                </div>`;
      return;
    }

    container.innerHTML = `<div class="notification-list">
            ${notifs
              .map((n) => {
                const isVerified = n.isVerified;
                const contact = n.contactInfo || {};
                const dateDisplay = new Date(n.createdAt).toLocaleDateString(
                  "mn-MN",
                );

                return `
                <article class="notification-card ${n.status}">
                    <div class="notif-header">
                        <div>
                            <h3 class="notif-title">${n.message}</h3>
                            <div class="notif-date">${dateDisplay}</div>
                        </div>
                    </div>

                    <div class="notif-body">
                        <div class="notif-ref">
                            <span>Холбогдох зар:</span>
                            ${
                              n.ad
                                ? `<a href="#detail/${n.ad._id}">${n.ad.title}</a>`
                                : `<span class="deleted-ad">Устгагдсан зар</span>`
                            }
                        </div>
                        
                        <div class="claim-details">
                            <div class="detail-row">
                                <span class="detail-label">Тайлбар:</span>
                                <span class="detail-value">${contact.description || "-"}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Онцлог:</span>
                                <span class="detail-value">${contact.features || "-"}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Байршил:</span>
                                <span class="detail-value">${contact.location || "-"}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Холбоо барих:</span>
                                <span class="detail-value"><a href="tel:${contact.contact}">${contact.contact}</a></span>
                            </div>
                        </div>
                    </div>
                
                    <div class="notif-actions">
                        ${
                          isVerified
                            ? `<div class="verify-badge">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                 Баталгаажсан
                               </div>`
                            : `<button class="btn btn--primary verify-btn" data-id="${n._id}">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                 Баталгаажуулах
                               </button>`
                        }
                    </div>
                </article>
                `;
              })
              .join("")}
        </div>`;

    // Add listeners
    container.querySelectorAll(".verify-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Энэ мэдээллийг зөв гэж баталгаажуулах уу?")) return;

        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = "Уншиж байна...";

        try {
          await api.verifyClaim(id, token);
          loadNotifications(token);
        } catch (e) {
          alert(e.message);
          btn.disabled = false;
          btn.textContent = "Баталгаажуулах";
        }
      });
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = `<p class="error">Алдаа: ${e.message}</p>`;
  }
}

async function loadUserAds(token, statsOnly = false) {
  if (!statsOnly) {
    const container = document.getElementById("my-ads-container");
    if (!container) return;
  }

  try {
    const [ads, user] = await Promise.all([
      api.getMyAds(token),
      api.getMe(token),
    ]);
    const statTotal = document.getElementById("stat-total");
    if (statTotal) statTotal.textContent = ads.length;

    const statFound = document.getElementById("stat-found");
    if (statFound)
      statFound.textContent = ads.filter((a) => a.status === "found").length;

    const statLost = document.getElementById("stat-lost");
    if (statLost)
      statLost.textContent = ads.filter((a) => a.status === "lost").length;

    if (statsOnly) return;

    const container = document.getElementById("my-ads-container");
    if (ads.length === 0) {
      container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem;">
                    <p>Та одоогоор зар оруулаагүй байна.</p>
                    <a href="#add" class="btn btn--primary" style="margin-top: 1rem;">Зар нэмэх</a>
                </div>
            `;
    } else {
      container.innerHTML = `<div class="cards">
                ${ads
                  .map((ad) =>
                    createAdCard(
                      ad,
                      user.savedAds?.some((s) => s._id === ad._id),
                    ),
                  )
                  .join("")}
            </div>`;
    }

    const savedContainer = document.getElementById("saved-ads");
    const savedAds = (user.savedAds || []).filter(
      (ad) => ad && typeof ad === "object" && ad._id,
    );

    if (savedContainer) {
      if (savedAds.length === 0) {
        savedContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--muted);">
                    <p>Хадгалсан зар байхгүй байна.</p>
                </div>
            `;
      } else {
        savedContainer.innerHTML = `<div class="cards">
                ${savedAds.map((ad) => createAdCard(ad, true)).join("")}
            </div>`;
      }
    }
  } catch (e) {
    console.error(e);
    if (!statsOnly) {
      const container = document.getElementById("my-ads-container");
      if (container)
        container.innerHTML = `<p class="error">Алдаа: ${e.message}</p>`;
    }
  }
}

function initProfileEvents(currentView = "ads") {
  const user = JSON.parse(localStorage.getItem("user"));
  const contentArea = document.getElementById("profile-content-area");

  const sidebarBtns = document.querySelectorAll(".sidebar-nav-btn");
  sidebarBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sidebarBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.target;
      if (target === "ads") {
        contentArea.innerHTML = renderAdsSection();
        initTabs();
        loadUserAds(user.token);
      } else if (target === "notifications") {
        contentArea.innerHTML = renderNotificationsSection();
        loadNotifications(user.token);
      }
    });
  });

  if (currentView === "ads") initTabs();

  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Та гарахдаа итгэлтэй байна уу?")) {
        localStorage.removeItem("user");
        window.location.hash = "#login";
        window.location.reload();
      }
    });
  }
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId =
        tab.dataset.tab === "active" ? "active-ads" : "saved-ads";

      const activeSection = document.getElementById("active-ads");
      const savedSection = document.getElementById("saved-ads");

      if (targetId === "active-ads") {
        if (activeSection) activeSection.style.display = "block";
        if (savedSection) savedSection.style.display = "none";
      } else {
        if (activeSection) activeSection.style.display = "none";
        if (savedSection) savedSection.style.display = "block";
      }
    });
  });
}
