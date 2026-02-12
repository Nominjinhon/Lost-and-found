import { getAllAds } from "./homeState.js";
import {
  renderAdsContainer,
  renderDefaultView,
  renderSortedView,
} from "./homeRenderer.js";

export function attachShowMoreListeners() {
  document.querySelectorAll(".show-more-btn").forEach((btn) => {
    btn.addEventListener("click", handleShowMore);
  });
}

export function handleShowMore(e) {
  const btn = e.currentTarget;
  const groupId = btn.dataset.group;
  const hiddenCards = document.querySelector(
    `.hidden-cards[data-group="${groupId}"]`,
  );

  if (hiddenCards) {
    const isHidden = hiddenCards.style.display === "none";
    hiddenCards.style.display = isHidden ? "block" : "none";

    const textEl = btn.querySelector(".show-more-text");
    const countEl = btn.querySelector(".show-more-count");
    const iconEl = btn.querySelector(".show-more-icon");

    if (isHidden) {
      textEl.textContent = "Хураах";
      countEl.style.display = "none";
      iconEl.style.transform = "rotate(180deg)";
      btn.classList.add("expanded");
    } else {
      textEl.textContent = "Бүгдийг харах";
      countEl.style.display = "inline";
      iconEl.style.transform = "rotate(0deg)";
      btn.classList.remove("expanded");
    }
  }
}

export function handleSortChange(e) {
  const sortValue = e.target.value;
  const container = document.getElementById("ads-container");

  if (!container) return;

  const allAds = getAllAds();

  if (sortValue === "default") {
    renderAdsContainer(renderDefaultView(allAds));
    attachShowMoreListeners();
  } else {
    let sortedAds = [...allAds];

    if (sortValue === "alphabet") {
      sortedAds.sort((a, b) => a.title.localeCompare(b.title, "mn"));
    } else if (sortValue === "date") {
      sortedAds.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderAdsContainer(renderSortedView(sortedAds));
  }
}
