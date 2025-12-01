class MainHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <header class="site" role="banner" aria-label="Эхлэл">
    <div class="top-row">
      <a class="brand" href="#" aria-label="Ollo">
        <img src="../images/logo.png" alt="Ollo logo" class="brand-logo" />
        <span class="brand-name">Ollo</span>
      </a>

      <form class="search" role="search" aria-label="Хайлт">
        <input id="search-input" type="search" placeholder="Хайлт хийх" />
        <button type="submit" aria-label="Хайх">
          <img src="../images/search.png" alt="Хайх" class="search-icon" />
        </button>
      </form>

      <nav class="actions" aria-label="Үйлдлүүд">
        <a class="outline-btn" href="#my-ads">Миний зар</a>
        <a class="btn" href="#add-ad">Зар нэмэх</a>
      </nav>
    </div>
  </header>`;
       
    }

}

window.customElements.define('main-header', MainHeader);