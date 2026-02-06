class LocationSelect extends HTMLElement {
  constructor() {
    super();
    this.locations = [
      "Улаанбаатар",
      "Архангай",
      "Баян-Өлгий",
      "Баянхонгор",
      "Булган",
      "Говь-Алтай",
      "Говьсүмбэр",
      "Дархан-Уул",
      "Дорноговь",
      "Дорнод",
      "Дундговь",
      "Завхан",
      "Орхон",
      "Өвөрхангай",
      "Өмнөговь",
      "Сүхбаатар",
      "Сэлэнгэ",
      "Төв",
      "Увс",
      "Ховд",
      "Хөвсгөл",
      "Хэнтий",
    ];
  }

  connectedCallback() {
    this.render();
  }

  get value() {
    return this.querySelector("select")?.value || "";
  }

  set value(val) {
    const select = this.querySelector("select");
    if (select) {
      select.value = val;
    }
  }

  render() {
    const selectedValue = this.getAttribute("value") || "Улаанбаатар";
    const name = this.getAttribute("name") || "location";
    const required = this.hasAttribute("required") ? "required" : "";
    const id = this.getAttribute("id") || "";

    const options = this.locations
      .map(
        (city) =>
          `<option value="${city}" ${city === selectedValue ? "selected" : ""}>${city}</option>`,
      )
      .join("");

    this.innerHTML = `
      <select name="${name}" id="${id}" class="location-select" ${required}>
        ${options}
      </select>
    `;

    this.querySelector("select").addEventListener("change", (e) => {});
  }
}

window.customElements.define("ol-location-select", LocationSelect);
