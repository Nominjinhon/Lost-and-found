import { icon } from "./icons.js";

class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let user = null;
    try {
      const userStr = localStorage.getItem("user");
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error("User parsing error", e);
    }

    this.render(user);
    if (user) {
      this.initNotificationLogic(user);
    }
  }

  render(user) {
    this.innerHTML = `
    <header class="site" role="banner" aria-label="Эхлэл">
        <div class="top-row">
             <a class="brand" href="#/" aria-label="Ollo">
                <img src="images/logo.png" alt="Ollo Logo" class="logo-img" />
                <span class="brand-name">Ollo</span>
            </a>

            <nav class="actions" aria-label="Үйлдлүүд">
                ${user ? this.userTemplate() : this.guestTemplate()}
            </nav>
        </div>
    </header>`;
  }

  userTemplate() {
    return `
      <a class="outline-btn" href="#profile" id="myAdsBtn">Миний зар</a>
      <a class="btn" href="#add">Зар нэмэх</a>
      <div style="position: relative;">
          <app-notification></app-notification>
          <notification-menu></notification-menu>
      </div>
      <a class="profile-link" href="#profile" aria-label="Профайл">
          ${icon("user", 20)}
      </a>
    `;
  }

  guestTemplate() {
    return `
      <a class="outline-btn" href="#login">Нэвтрэх</a>
      <a class="btn" href="#register">Бүртгүүлэх</a>
    `;
  }

  initNotificationLogic(user) {
    const bell = this.querySelector("app-notification");
    const menu = this.querySelector("notification-menu");
    const myAdsBtn = this.querySelector("#myAdsBtn");

    if (myAdsBtn) {
      myAdsBtn.addEventListener("click", () => {
        sessionStorage.setItem("profileView", "ads");
      });
    }

    if (bell && menu) {
      bell.addEventListener("toggle", () => {
        menu.toggle();
        if (menu.open) menu.loadNotifications(user.token);
      });

      menu.addEventListener("update-count", (e) => {
        bell.updateCount(e.detail.count);
      });

      customElements.whenDefined("notification-menu").then(() => {
        if (menu.loadNotifications) {
          menu.loadNotifications(user.token);
        }
      });
    }
  }
}

window.customElements.define("main-header", MainHeader);
