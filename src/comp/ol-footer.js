class MainFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="site" role="contentinfo">
        <nav aria-label="Footer links">
          <a href="#">D\`D,D'D«D,D1 ¥,¥Ÿ¥.DøD1</a>
          <a href="#">DD_D¯DñD_D3D'D_¥.</a>
          <a href="#">D›¥Ÿ¥?D¯DøD¬D</a>
        </nav>
        <address class="brand-addr" aria-label="DD_D¯DñD_D_">
          <img src="images/logo.png" alt="Ollo Logo" class="footer-logo" />
          <span>Ollo</span>
        </address>
        <small class="copyright">TeamName Ac 2025. D\`O_¥. ¥?¥?¥. ¥.¥Ÿ¥ŸD¯D,Dø¥? ¥.DøD¬D3DøDøD¯DøD3D'¥?DøD«.</small>
      </footer>
    `;
  }
}

window.customElements.define('main-footer', MainFooter);
