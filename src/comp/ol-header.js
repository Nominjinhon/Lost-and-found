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
        <a class="profile-link" href="#profile" aria-label="Профайл">
          <img src="images/user.png" alt="Хэрэглэгчийн профайл" class="profile-icon" />
        </a>
      </nav>
    </div>
  </header>`;
       
    }

}

window.customElements.define('main-header', MainHeader);