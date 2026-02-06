import { icon } from "./icons.js";

class AppNotification extends HTMLElement {
  connectedCallback() {
    this.render(0);
  }

  updateCount(count) {
    this.render(Number(count));
  }

  render(count) {
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
