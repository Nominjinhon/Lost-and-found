class MainSearch extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <form class="search-main" role="search" aria-label="Хайлт хийх">
        <input id="search-input" type="search" placeholder="Хайх зүйлээ оруулна уу..." />
        <button type="submit" aria-label="Хайх">
          <img src="images/search.png" alt="" class="search-icon" />
        </button>
      </form>
    `;
  }
}

window.customElements.define('main-search', MainSearch);
