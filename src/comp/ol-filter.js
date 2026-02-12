class FilterSidebar extends HTMLElement {
  constructor() {
    super();
    this.state = {
      type: this.getAttribute("type") || "lost",
      location: "Улаанбаатар",
      categories: new Set(),
      startDate: null,
      endDate: null,
      monthOffset: 0,
    };

    this._onClick = this._onClick.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this._onClick);
    this.addEventListener("change", this._onChange);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("change", this._onChange);
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this._emit();
  }

  get value() {
    return {
      type: this.state.type,
      location: this.state.location,
      categories: Array.from(this.state.categories),
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };
  }

  _emit() {
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this.value }),
    );
  }

  _onClick(e) {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      const action = actionEl.getAttribute("data-action");
      if (action === "clear") {
        this.state.categories.clear();
        this.setState({
          type: "lost",
          location: "Улаанбаатар",
          startDate: null,
          endDate: null,
          monthOffset: 0,
        });
      } else if (action === "prev-month") {
        this.setState({ monthOffset: this.state.monthOffset - 1 });
      } else if (action === "next-month") {
        this.setState({ monthOffset: this.state.monthOffset + 1 });
      }
    }

    const dayBtn = e.target.closest("button[data-date]");
    if (dayBtn) {
      const iso = dayBtn.getAttribute("data-date");
      let { startDate, endDate } = this.state;

      if (!startDate || (startDate && endDate)) {
        startDate = iso;
        endDate = null;
      } else {
        if (new Date(iso) < new Date(startDate)) {
          startDate = iso;
        } else {
          endDate = iso;
        }
      }
      this.setState({ startDate, endDate });
    }
  }

  _onChange(e) {
    const t = e.target;
    if (t.name === "fs-type") this.setState({ type: t.value });
    if (t.name === "fs-location") this.setState({ location: t.value });
    if (t.name === "fs-category") {
      t.checked
        ? this.state.categories.add(t.value)
        : this.state.categories.delete(t.value);
      this.setState({});
    }
  }

  _calendarData() {
    const now = new Date();
    const view = new Date(
      now.getFullYear(),
      now.getMonth() + this.state.monthOffset,
      1,
    );
    const year = view.getFullYear();
    const month = view.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = (first.getDay() + 6) % 7;
    const lastDate = new Date(year, month + 1, 0).getDate();

    const grid = [];
    for (let i = 0; i < startWeekday; i++) grid.push(null);
    for (let d = 1; d <= lastDate; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);

    const monthName = view.toLocaleString("mn-MN", { month: "long" });
    return { year, month, monthName, grid };
  }

  _toISO(year, month0, day) {
    return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  render() {
    const categories = [
      "Гар утас",
      "Түрийвч",
      "Түлхүүр",
      "Бичиг баримт",
      "Цүнх",
      "Цаг",
      "Бусад",
    ];
    const { year, month, monthName, grid } = this._calendarData();

    const catItems = categories
      .map(
        (cat) => `
      <li>
        <label class="check">
          <input type="checkbox" name="fs-category" value="${cat}" ${this.state.categories.has(cat) ? "checked" : ""} />
          <span>${cat}</span>
        </label>
      </li>
    `,
      )
      .join("");

    const calCells = grid
      .map((d) => {
        if (!d) return `<li class="cell cell--empty" aria-hidden="true"></li>`;
        const iso = this._toISO(year, month, d);
        let classes = ["cell"];
        if (this.state.startDate === iso)
          classes.push("cell--start", "cell--selected");
        if (this.state.endDate === iso) classes.push("cell--end");
        if (
          this.state.startDate &&
          this.state.endDate &&
          iso > this.state.startDate &&
          iso < this.state.endDate
        ) {
          classes.push("cell--in-range");
        }
        return `<li><button type="button" class="${classes.join(" ")}" data-date="${iso}">${String(d).padStart(2, "0")}</button></li>`;
      })
      .join("");

    this.innerHTML = `
      <aside aria-label="Filter sidebar">
        <header>
          <fieldset>
            <legend>Төрөл</legend>
            <label class="radio">
              <input type="radio" name="fs-type" value="lost" ${this.state.type === "lost" ? "checked" : ""} />
              <span>Хаясан</span>
            </label>
            <label class="radio">
              <input type="radio" name="fs-type" value="found" ${this.state.type === "found" ? "checked" : ""} />
              <span>Олсон</span>
            </label>
          </fieldset>
          <button class="clear" type="button" data-action="clear" aria-label="Цэвэрлэх">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <section>
          <h3>Хаана</h3>
          <ol-location-select name="fs-location" value="${this.state.location}"></ol-location-select>
        </section>

        <section class="calendar">
          <h3>Хэзээ</h3>
          <article>
            <nav class="month">
              <button type="button" data-action="prev-month">❮</button>
              <strong>${monthName} ${year}</strong>
              <button type="button" data-action="next-month">❯</button>
            </nav>
            <ol class="dow">
              <li>Да</li><li>Мя</li><li>Лх</li><li>Пү</li><li>Ба</li><li>Бя</li><li>Ня</li>
            </ol>
            <ol class="grid">${calCells}</ol>
          </article>
        </section>

        <section>
          <h3>Юу</h3>
          <ul class="scroll">${catItems}</ul>
        </section>
      </aside>
    `;
  }
}

window.customElements.define("filter-sidebar", FilterSidebar);
