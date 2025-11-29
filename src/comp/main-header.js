class MainHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <header class="site" role="banner" aria-label="Эхлэл">
    <div class="top-row">
      <a class="brand" href="#" aria-label="Ollo">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10" fill="#e6fbef"></circle>
          <path d="M7 12h10M12 7v10" stroke="#18a861" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span class="brand-name">Ollo</span>
      </a>

      <form class="search" role="search" aria-label="Хайлт">
        <input id="search-input" type="search" placeholder="Хайлт хийх" />
        <button type="submit" aria-label="Хайх">
          🔍
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