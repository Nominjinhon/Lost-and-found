export function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId =
        tab.dataset.tab === "active" ? "active-ads" : "saved-ads";

      const activeSection = document.getElementById("active-ads");
      const savedSection = document.getElementById("saved-ads");

      if (targetId === "active-ads") {
        if (activeSection) activeSection.style.display = "block";
        if (savedSection) savedSection.style.display = "none";
      } else {
        if (activeSection) activeSection.style.display = "none";
        if (savedSection) savedSection.style.display = "block";
      }
    });
  });
}
