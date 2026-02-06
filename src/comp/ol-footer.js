class MainFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="site" role="contentinfo">
        <nav aria-label="Footer links">
          <a href="#">Бидний тухай</a>
          <a href="#">Холбоо барих</a>
          <a href="#">Тусламж</a>
        </nav>
        <address class="brand-addr" aria-label="Ollo">
          <img src="images/logo.png" alt="Ollo Logo" class="footer-logo" />
          <span>Ollo</span>
        </address>
        <small class="copyright">Ollo Ac 2025. Бүх эрх хуулиар хамгаалагдсан.</small>
      </footer>
    `;
  }
}

window.customElements.define("main-footer", MainFooter);
