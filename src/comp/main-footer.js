class MainFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <footer class="site" role="contentinfo">
    <nav aria-label="Footer links">
      <a href="#">Бидний тухай</a>
      <a href="#">Холбогдох</a>
      <a href="#">Тусламж</a>
    </nav>
    <address class="brand-addr" aria-label="Холбоо">
      <img src="../images/logo.png" alt="Ollo logo" class="brand-logo" />
      <span>Ollo</span>
    </address>
    <small class="copyright">TeamName © 2025. Бүх эрх хуулиар хамгаалагдсан.</small>
    </footer>`;
       
    }

}

window.customElements.define('main-footer', MainFooter);