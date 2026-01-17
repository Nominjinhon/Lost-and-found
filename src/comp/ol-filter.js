class FilterSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.state = {
      type: this.getAttribute("type") || "lost",
      locations: new Set(),
      categories: new Set(),
      date: this.getAttribute("date") || null,
      monthOffset: 0,
    };

    this._onClick = this._onClick.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  connectedCallback() {
    const locationsAttr = this.getAttribute("locations");
    const categoriesAttr = this.getAttribute("categories");

    if (locationsAttr) {
      locationsAttr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((v) => this.state.locations.add(v));
    }

    if (categoriesAttr) {
      categoriesAttr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((v) => this.state.categories.add(v));
    }

    this.render();
    this.shadowRoot.addEventListener("click", this._onClick);
    this.shadowRoot.addEventListener("change", this._onChange);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("click", this._onClick);
    this.shadowRoot.removeEventListener("change", this._onChange);
  }

  get value() {
    return {
      type: this.state.type,
      locations: Array.from(this.state.locations),
      categories: Array.from(this.state.categories),
      date: this.state.date,
    };
  }

  _emit() {
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this.value })
    );
  }

  _onClick(e) {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      const action = actionEl.getAttribute("data-action");

      if (action === "clear") {
        this.state.type = "lost";
        this.state.locations.clear();
        this.state.categories.clear();
        this.state.date = null;
        this.state.monthOffset = 0;
        this.render();
        this._emit();
        return;
      }

      if (action === "prev-month") {
        this.state.monthOffset -= 1;
        this.render();
        return;
      }

      if (action === "next-month") {
        this.state.monthOffset += 1;
        this.render();
        return;
      }
    }

    const dayBtn = e.target.closest("button[data-date]");
    if (dayBtn) {
      const iso = dayBtn.getAttribute("data-date");
      this.state.date = this.state.date === iso ? null : iso;
      this.render();
      this._emit();
    }
  }

  _onChange(e) {
    const t = e.target;

    if (t.name === "fs-type") {
      this.state.type = t.value;
      this._emit();
      return;
    }

    if (t.name === "fs-location") {
      const v = t.value;
      t.checked ? this.state.locations.add(v) : this.state.locations.delete(v);
      this._emit();
      return;
    }

    if (t.name === "fs-category") {
      const v = t.value;
      t.checked ? this.state.categories.add(v) : this.state.categories.delete(v);
      this._emit();
    }
  }

  _getLists() {
    const locOpt = this.getAttribute("location-options");
    const catOpt = this.getAttribute("category-options");

    let locations = [
      "Улаанбаатар",
      "Дархан",
      "Эрдэнэт",
      "Баянхонгор",
      "Завхан",
      "Хөвсгөл",
      "Орхон",
      "Өмнөговь",
    ];

    let categories = [
      "Гар утас",
      "Түрийвч",
      "Түлхүүр",
      "Бичиг баримт",
      "Цүнх",
      "Цаг",
      "Бусад",
    ];

    try { if (locOpt) locations = JSON.parse(locOpt); } catch {}
    try { if (catOpt) categories = JSON.parse(catOpt); } catch {}

    return { locations, categories };
  }

  _calendarData() {
    const now = new Date();
    const view = new Date(now.getFullYear(), now.getMonth() + this.state.monthOffset, 1);
    const year = view.getFullYear();
    const month = view.getMonth();

    const first = new Date(year, month, 1);
    const startWeekday = (first.getDay() + 6) % 7; // Monday=0
    const lastDate = new Date(year, month + 1, 0).getDate();

    const grid = [];
    for (let i = 0; i < startWeekday; i++) grid.push(null);
    for (let d = 1; d <= lastDate; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);

    const monthName = view.toLocaleString("en-US", { month: "long" });
    return { year, month, monthName, grid };
  }

  _toISO(year, month0, day) {
    const mm = String(month0 + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  render() {
    const { locations, categories } = this._getLists();
    const { year, month, monthName, grid } = this._calendarData();

    const selectedCity = Array.from(this.state.locations)[0] || "Улаанбаатар";

    const locItems = locations
      .map(
        (city) => `
          <li>
            <label class="check">
              <input type="checkbox" name="fs-location" value="${city}" ${
          this.state.locations.has(city) ? "checked" : ""
        } />
              <span>${city}</span>
            </label>
          </li>
        `
      )
      .join("");

    const catItems = categories
      .map(
        (cat) => `
          <li>
            <label class="check">
              <input type="checkbox" name="fs-category" value="${cat}" ${
          this.state.categories.has(cat) ? "checked" : ""
        } />
              <span>${cat}</span>
            </label>
          </li>
        `
      )
      .join("");

    const calCells = grid
      .map((d) => {
        if (!d) return `<li class="cell cell--empty" aria-hidden="true"></li>`;
        const iso = this._toISO(year, month, d);
        const selected = this.state.date === iso ? "cell--selected" : "";
        return `
          <li>
            <button type="button" class="cell ${selected}" data-date="${iso}" aria-pressed="${
          selected ? "true" : "false"
        }">
              ${String(d).padStart(2, "0")}
            </button>
          </li>
        `;
      })
      .join("");

    this.shadowRoot.innerHTML = `
      <style>
        :host{
          --fs-accent: var(--accent, #18a861);
          --fs-card: var(--card, #ffffff);
          --fs-border: rgba(7, 22, 51, 0.08);
          --fs-text: #0b2a4b;
          --fs-muted: var(--muted, #6b7280);
          --fs-shadow: var(--shadow, 0 8px 22px rgba(2,6,23,0.06));
          --radius: 14px;
          display:block;
          font-family: inherit;
          color: inherit;
        }

        aside{
          width:100%;
          max-width:92vw;
          background:var(--fs-card);
          border:1px solid var(--fs-border);
          border-radius:var(--radius);
          padding:16px 14px;
          box-shadow: var(--fs-shadow);
        }

        header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
          margin-bottom:10px;
        }

        fieldset{
          border:0;
          padding:0;
          margin:0;
          display:grid;
          gap:10px;
          min-inline-size:0;
        }

        legend{
          position:absolute;
          inline-size:1px;
          block-size:1px;
          overflow:hidden;
          clip:rect(0 0 0 0);
          white-space:nowrap;
        }

        label.radio{
          display:inline-flex;
          align-items:center;
          gap:10px;
          font-weight:600;
        }
        label.radio input{
          width:18px;
          height:18px;
          accent-color:var(--fs-accent);
        }

        button.clear{
          border:0;
          background:transparent;
          color:var(--fs-muted);
          font-weight:600;
          cursor:pointer;
          padding:6px 8px;
          border-radius:10px;
        }
        button.clear:hover{ background:rgba(24,168,97,0.08); }

        section{ padding:10px 0 2px; }

        h3{
          margin:10px 0 10px;
          font-size:1.05rem;
          letter-spacing:-0.01em;
          font-weight:700;
          color: var(--fs-text);
        }

        ul.scroll{
          list-style:none;
          margin:0;
          padding:0 6px 0 0;
          max-height:150px;
          overflow:auto;
          display:grid;
          gap:10px;
        }

        ul.scroll::-webkit-scrollbar{ width:8px; }
        ul.scroll::-webkit-scrollbar-thumb{ background:rgba(107,114,128,0.45); border-radius:99px; }
        ul.scroll::-webkit-scrollbar-track{ background:transparent; }

        label.check{
          display:inline-flex;
          align-items:center;
          gap:10px;
          font-weight:600;
          color:var(--fs-muted);
        }
        label.check input{
          width:18px;
          height:18px;
          border-radius:6px;
          accent-color:var(--fs-accent);
        }

        figure.map{
          margin:10px 0 0;
          height:92px;
          border-radius:16px;
          border:1px solid var(--fs-border);
          background:#fff;
          position:relative;
          overflow:hidden;

          background-image:
            radial-gradient(circle at 20% 30%, rgba(24,168,97,.18), transparent 32%),
            radial-gradient(circle at 70% 55%, rgba(24,168,97,.12), transparent 35%),
            linear-gradient(0deg, rgba(31,42,68,.06), rgba(31,42,68,.06));
        }

        figcaption.badge{
          position:absolute;
          inset:auto auto 10px 10px;
          display:flex;
          align-items:center;
          gap:10px;
          background:rgba(255,255,255,0.92);
          border:1px solid var(--fs-border);
          border-radius:14px;
          padding:8px 10px;
          box-shadow:0 10px 18px rgba(0,0,0,0.06);
        }

        i.pin{
          inline-size:10px;
          block-size:10px;
          background:#ef4444;
          border-radius:999px;
          box-shadow:0 0 0 4px rgba(239,68,68,.18);
        }

        figcaption small{
          display:block;
          color:var(--fs-muted);
          font-size:12px;
          margin-top:2px;
        }

        /* Calendar */
        section.calendar > article{
          background:#fff;
          border:1px solid var(--fs-border);
          border-radius:16px;
          padding:12px;
        }

        nav.month{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:8px;
        }

        nav.month strong{ font-weight:700; }

        nav.month button{
          width:34px;
          height:34px;
          border-radius:12px;
          border:1px solid var(--fs-border);
          background:#fff;
          cursor:pointer;
        }
        nav.month button:hover{ background:rgba(24,168,97,0.08); }

        ol.dow{
          list-style:none;
          margin:0 0 6px;
          padding:0;
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:6px;
          color:var(--fs-muted);
          font-weight:700;
          font-size:12px;
          text-transform:lowercase;
        }

        ol.grid{
          list-style:none;
          margin:0;
          padding:0;
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:6px;
        }

        .cell{
          display:grid;
          place-items:center;
          height:34px;
          border-radius:10px;
          border:1px solid transparent;
          background:#fff;
          cursor:pointer;
          font-weight:700;
          color:var(--fs-text);
          width:100%;
        }

        li.cell.cell--empty{
          height:34px;
          border-radius:10px;
          background:transparent;
        }

        .cell:hover{ border-color:rgba(24,168,97,0.45); }
        .cell--selected{ background:var(--fs-accent); color:#ffffff; border-color: rgba(24,168,97,0.65); }

        @media (max-width:420px){
          aside{ max-width:100%; }
        }
      </style>

      <aside aria-label="Filter sidebar">
        <header>
          <fieldset aria-label="Төрөл">
            <legend>Төрөл</legend>

            <label class="radio">
              <input type="radio" name="fs-type" value="lost" ${
                this.state.type === "lost" ? "checked" : ""
              } />
              <span>Хаясан</span>
            </label>

            <label class="radio">
              <input type="radio" name="fs-type" value="found" ${
                this.state.type === "found" ? "checked" : ""
              } />
              <span>Олсон</span>
            </label>
          </fieldset>

          <button class="clear" type="button" data-action="clear">Цэвэрлэх</button>
        </header>

        <section aria-label="Байршлын шүүлтүүр">
          <h3>Хаана</h3>

          <ul class="scroll" aria-label="Хот сонгох">
            ${locItems}
          </ul>

          <figure class="map" role="img" aria-label="Map preview">
            <figcaption class="badge">
              <i class="pin" aria-hidden="true"></i>
              <span>
                <strong>${selectedCity}</strong>
                <small>${selectedCity}</small>
              </span>
            </figcaption>
          </figure>
        </section>

        <section class="calendar" aria-label="Огнооны шүүлтүүр">
          <h3>Хэзээ</h3>

          <article aria-label="Calendar widget">
            <nav class="month" aria-label="Сар сонгох">
              <button type="button" data-action="prev-month" aria-label="Өмнөх сар">‹</button>
              <strong>${monthName}</strong>
              <button type="button" data-action="next-month" aria-label="Дараагийн сар">›</button>
            </nav>

            <ol class="dow" aria-hidden="true">
              <li>m</li><li>t</li><li>w</li><li>t</li><li>f</li><li>s</li><li>s</li>
            </ol>

            <ol class="grid" aria-label="Өдрүүд">
              ${calCells}
            </ol>
          </article>
        </section>

        <section aria-label="Зүйлийн шүүлтүүр">
          <h3>Юу</h3>
          <ul class="scroll" aria-label="Төрөл сонгох">
            ${catItems}
          </ul>
        </section>
      </aside>
    `;
  }
}

window.customElements.define("filter-sidebar", FilterSidebar);
