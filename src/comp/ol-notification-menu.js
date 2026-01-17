// src/comp/ol-notification-menu.js
class NotificationMenu extends HTMLElement {
  constructor() {
    super();
    this.open = false;
    this.items = [
      { title: "MacBook Pro", text: "Эд зүйлийг олсон", time: "1 цагийн өмнө", href: "#/my-ads" },
      { title: "Түлхүүр", text: "Шинэ зар нэмэгдлээ", time: "2 цагийн өмнө", href: "#/" },
    ];

    this.onDocClick = this.onDocClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  connectedCallback() {
    this.render();
    document.addEventListener("click", this.onDocClick);
    document.addEventListener("keydown", this.onKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.onDocClick);
    document.removeEventListener("keydown", this.onKeyDown);
  }

  toggle() {
    this.open = !this.open;
    this.render();
  }

  close() {
    if (!this.open) return;
    this.open = false;
    this.render();
  }

  onDocClick(e) {
    if (!this.open) return;
    if (!this.contains(e.target)) this.close();
  }

  onKeyDown(e) {
    if (e.key === "Escape") this.close();
  }

  render() {
    this.innerHTML = `
      <div class="notif-menu ${this.open ? "is-open" : ""}" aria-label="Мэдэгдлүүд">
        <ul class="notif-list">
          ${this.items.map(n => `
            <li class="notif-item">
              <a class="notif-link" href="${this.escape(n.href)}">
                <span class="notif-bar" aria-hidden="true"></span>
                <span class="notif-body">
                  <strong class="notif-title">${this.escape(n.title)}</strong>
                  <span class="notif-text">${this.escape(n.text)}</span>
                </span>
                <time class="notif-time">${this.escape(n.time)}</time>
              </a>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  escape(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

customElements.define("notification-menu", NotificationMenu);
