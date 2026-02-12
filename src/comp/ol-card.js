import { icon } from "./icons.js";

class AdCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const image = this.getAttribute("image") || "../images/backpack.png";
    const alt = this.getAttribute("alt") || "Зураг";
    const date = this.getAttribute("date") || "";
    const location = this.getAttribute("location") || "";
    const status = this.getAttribute("status") || "lost";
    const id = this.getAttribute("id") || "ad-default";

    const statusClass = status === "found" ? "green" : "red";

    this.innerHTML = `
        <article class="card" aria-labelledby="${id}" data-id="${id}">
          <button class="bookmark" aria-label="Хадгалах">
            <svg class="bookmark-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <figure class="thumb" role="img" aria-label="Зураг">
            <img src="${image}" alt="${alt}">
          </figure>
          <h3 id="${id}" class="card-title"><span class="status-dot ${statusClass}" aria-hidden="true">●</span> ${title}</h3>
          <p class="meta">
            ${icon("calendar", 16)}
            <span>${date}</span>
          </p>
          <p class="location">
            ${icon("location", 16)}
            <span>${location}</span>
          </p>
        </article>
        `;

    this.initEvents(id);
  }

  initEvents(id) {
    const card = this.querySelector(".card");
    const bookmarkBtn = this.querySelector(".bookmark");

    if (this.hasAttribute("is-saved") && bookmarkBtn) {
      bookmarkBtn.classList.add("saved");
    }

    if (card) {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".bookmark")) return;
        window.location.hash = `#detail/${id}`;
      });
    }

    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const userStr = localStorage.getItem("user");
        if (!userStr) {
          alert("Та эхлээд нэвтэрнэ үү");
          return;
        }

        const user = JSON.parse(userStr);

        try {
          bookmarkBtn.classList.toggle("saved");

          const { api } = await import("../api.js");
          await api.toggleBookmark(id, user.token);

          const isNowSaved = bookmarkBtn.classList.contains("saved");
          bookmarkBtn.setAttribute(
            "aria-label",
            isNowSaved ? "Хадгалсан" : "Хадгалах",
          );
        } catch (err) {
          console.error(err);
          bookmarkBtn.classList.toggle("saved");
          alert("Алдаа гарлаа: " + err.message);
        }
      });
    }
  }
}

window.customElements.define("ad-card", AdCard);
