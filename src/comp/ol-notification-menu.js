import { api } from "../api.js";

class NotificationMenu extends HTMLElement {
  constructor() {
    super();
    this.open = false;
    this.items = [];
    this._token = null;

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

  async loadNotifications(token) {
    this._token = token;
    try {
      const notifs = await api.getMyNotifications(token);
      this.items = notifs.map((n) => ({
        id: n._id,
        title: n.message,
        text: n.ad ? n.ad.title : "Устгагдсан зар",
        time: new Date(n.createdAt).toLocaleDateString("mn-MN"),
        href: n.ad ? `#/detail/${n.ad._id}` : "#profile",
        href: "#profile",
        action: "notifications",
        unread: n.status === "unread",
      }));
      this.render();

      const unreadCount = this.items.filter((i) => i.unread).length;
      this.dispatchEvent(
        new CustomEvent("update-count", {
          bubbles: true,
          detail: { count: unreadCount },
        }),
      );
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
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

  onItemClick(e, item) {
    if (item.action === "notifications") {
      sessionStorage.setItem("profileView", "notifications");
      this.close();
    }
  }

  render() {
    const content =
      this.items.length === 0
        ? `<li class="notif-item"><div class="notif-link" style="padding:1rem;color:var(--muted)">Мэдэгдэл алга</div></li>`
        : this.items
            .slice(0, 5)
            .map(
              (n) => `
            <li class="notif-item">
              <a class="notif-link" href="${n.href}" onclick="this.getRootNode().host.onItemClick(event, {action: '${n.action}'})">
                <span class="notif-bar ${n.unread ? "" : "read"}" aria-hidden="true" style="${n.unread ? "" : "background:transparent"}"></span>
                <span class="notif-body">
                  <strong class="notif-title">${this.escape(n.title)}</strong>
                  <span class="notif-text">${this.escape(n.text)}</span>
                </span>
                <time class="notif-time">${this.escape(n.time)}</time>
              </a>
            </li>
          `,
            )
            .join("");

    this.innerHTML = `
      <div class="notif-menu ${this.open ? "is-open" : ""}" aria-label="Мэдэгдлүүд">
        <ul class="notif-list">
          ${content}
          ${
            this.items.length > 0
              ? `
           <li style="border-top:1px solid #eee;">
             <a href="#profile" onclick="sessionStorage.setItem('profileView', 'notifications');" 
                style="display:block;padding:10px;text-align:center;font-size:0.9rem;color:var(--accent);text-decoration:none;">
                Бүх мэдэгдлийг харах
             </a>
           </li>
          `
              : ""
          }
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
