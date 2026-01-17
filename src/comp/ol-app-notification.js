// src/comp/ol-app-notification.js
import { icon } from "./icons.js";

class AppNotification extends HTMLElement {
  connectedCallback() {
    const count = Number(this.getAttribute("count") || 0);

    this.innerHTML = `
      <button type="button" class="icon-btn notif-btn" aria-label="Мэдэгдлүүд">
        ${icon("bell", 22)}
        ${count > 0 ? `<span class="notif-dot" aria-hidden="true"></span>` : ``}
      </button>
    `;

    this.querySelector(".notif-btn").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); 
      this.dispatchEvent(new CustomEvent("toggle", { bubbles: true }));
    });
  }
}

customElements.define("app-notification", AppNotification);
