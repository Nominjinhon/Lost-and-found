class MainSearch extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <form class="search-main" role="search" aria-label="DDøD1D¯¥,">
        <input id="search-input" type="search" placeholder="DDøD1D¯¥, ¥.D,D1¥." />
        <button type="submit" aria-label="DDøD1¥.">
          <img src="images/search.png" alt="" class="search-icon" />
        </button>
      </form>
    `;
  }
}

window.customElements.define('main-search', MainSearch);
