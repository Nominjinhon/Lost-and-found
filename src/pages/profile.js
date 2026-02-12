import {
  renderAdsSection,
  renderNotificationsSection,
} from "./profile/profileRenderer.js";
import { loadNotifications } from "./profile/profileNotifications.js";
import { loadUserAds } from "./profile/profileAds.js";
import { initTabs } from "./profile/profileTabs.js";

export function ProfilePage() {
  let view = "ads";
  const savedView = sessionStorage.getItem("profileView");
  if (savedView) {
    view = savedView;
    sessionStorage.removeItem("profileView");
  }

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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
    initProfileEvents(user.token, view);

    loadUserAds(user.token);
    if (view === "notifications") {
      loadNotifications(user.token);
    }
  }, 0);

  return html;
}

function initProfileEvents(token, currentView = "ads") {
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
        loadUserAds(token);
      } else if (target === "notifications") {
        contentArea.innerHTML = renderNotificationsSection();
        loadNotifications(token);
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
