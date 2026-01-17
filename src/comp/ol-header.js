class MainHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <header class="site" role="banner" aria-label="Эхлэл">
    <div class="top-row">
      <a class="brand" href="#/" aria-label="Ollo">
        <img src="images/logo.png" alt="Ollo Logo" class="logo-img" />
        <span class="brand-name">Ollo</span>
      </a>

      <nav class="actions" aria-label="Үйлдлүүд">
        <a class="outline-btn" href="#my-ads">Миний зар</a>
        <a class="btn" href="#add">Зар нэмэх</a>
            <app-notification count="1"></app-notification>
            <notification-menu></notification-menu>
        <a class="profile-link" href="#profile" aria-label="Профайл">
          <img src="images/user.png" alt="Хэрэглэгчийн профайл" class="profile-icon" />
        </a>
      </nav>
    </div>
  </header>`;

  const bell = this.querySelector("app-notification");
    const menu = this.querySelector("notification-menu");
    if (bell && menu) {
      bell.addEventListener("toggle", () => menu.toggle());
    }
       
    }

}

window.customElements.define('main-header', MainHeader);