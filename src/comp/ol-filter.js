class FilterSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.state = {
      type: this.getAttribute("type") || "lost",
      location: "Улаанбаатар", // Default location
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
      location: this.state.location,
      categories: Array.from(this.state.categories),
      startDate: this.state.startDate,
      endDate: this.state.endDate,
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
        this.state.location = "Улаанбаатар";
        this.state.categories.clear();
        this.state.startDate = null;
        this.state.endDate = null;
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

      if (!this.state.startDate || (this.state.startDate && this.state.endDate)) {
        // New range start
        this.state.startDate = iso;
        this.state.endDate = null;
      } else if (this.state.startDate && !this.state.endDate) {
        // Range end?
        if (new Date(iso) < new Date(this.state.startDate)) {
          // User clicked earlier date, swap or reset? Let's just reset start
          this.state.startDate = iso;
        } else {
          this.state.endDate = iso;
        }
      }

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
      this.state.location = t.value;
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
    // List of Mongolia's 21 Aimags + Ulaanbaatar
    const locations = [
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
      "Хэнтий"
    ];

    const categories = [
      "Гар утас",
      "Түрийвч",
      "Түлхүүр",
      "Бичиг баримт",
      "Цүнх",
      "Цаг",
      "Бусад",
    ];

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

    const monthName = view.toLocaleString("mn-MN", { month: "long" }); // Use Mongolian locale if available
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

    // Location Dropdown Options
    const locOptions = locations.map(city =>
      `<option value="${city}" ${this.state.location === city ? "selected" : ""}>${city}</option>`
    ).join("");


    // Categories Checkboxes
    const catItems = categories
      .map(
        (cat) => `
          <li>
            <label class="check">
              <input type="checkbox" name="fs-category" value="${cat}" ${this.state.categories.has(cat) ? "checked" : ""
          } />
              <span>${cat}</span>
            </label>
          </li>
        `
      )
      .join("");

    // Calendar Cells
    const calCells = grid.map((d) => {
      if (!d) return `<li class="cell cell--empty" aria-hidden="true"></li>`;

      const iso = this._toISO(year, month, d);
      let classes = ["cell"];

      // Range Selection Logic
      if (this.state.startDate === iso) classes.push("cell--start");
      if (this.state.endDate === iso) classes.push("cell--end");

      if (this.state.startDate && this.state.endDate) {
        if (iso > this.state.startDate && iso < this.state.endDate) {
          classes.push("cell--in-range");
        }
      } else if (this.state.startDate === iso) {
        classes.push("cell--selected"); // Provide visual feedback for single selection too
      }

      return `
          <li>
            <button type="button" class="${classes.join(" ")}" data-date="${iso}">
              ${String(d).padStart(2, "0")}
            </button>
          </li>
        `;
    }).join("");

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
          max-width:300px; /* Sidebar width adjustment */
          background:var(--fs-card);
          border:1px solid var(--fs-border);
          border-radius:var(--radius);
          padding:20px;
          box-shadow: var(--fs-shadow);
        }

        header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
          margin-bottom:20px;
          border-bottom: 1px solid var(--fs-border);
          padding-bottom: 15px;
        }

        fieldset{
          border:0;
          padding:0;
          margin:0;
          display:flex; /* Toggle style */
          gap:10px;
          background: #f1f3f5;
          padding: 4px;
          border-radius: 12px;
        }

        /* Toggle Button Style for Type */
        label.radio {
            position: relative;
            cursor: pointer;
            padding: 8px 16px;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--fs-muted);
            transition: all 0.2s;
            border-radius: 8px;
            z-index: 1;
        }

        label.radio input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        label.radio:has(input:checked) {
            background-color: #fff;
            color: var(--fs-text);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        button.clear{
          border:0;
          background:transparent;
          color:var(--fs-muted);
          font-weight:600;
          cursor:pointer;
          font-size: 0.9rem;
        }
        button.clear:hover{ text-decoration: underline; color: var(--fs-accent); }

        section{ margin-bottom: 24px; }

        h3{
          margin:0 0 12px;
          font-size:1rem;
          font-weight:700;
          color: var(--fs-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Dropdown Style */
        select.location-select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--fs-border);
            border-radius: 10px;
            font-size: 0.95rem;
            color: var(--fs-text);
            background-color: #fff;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
        }
        select.location-select:focus {
            border-color: var(--fs-accent);
            box-shadow: 0 0 0 3px rgba(24,168,97,0.1);
        }

        /* Checkboxes List */
        ul.scroll{
          list-style:none;
          margin:0;
          padding:0;
          display:grid;
          gap:12px;
        }

        label.check{
          display:inline-flex;
          align-items:center;
          gap:10px;
          font-weight:500;
          color:var(--fs-text);
          cursor: pointer;
          font-size: 0.95rem;
        }
        label.check input{
          width:18px;
          height:18px;
          border-radius:4px;
          accent-color:var(--fs-accent);
          cursor: pointer;
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
          margin-bottom:12px;
        }

        nav.month strong{ font-weight:700; color: var(--fs-text); font-size: 0.95rem; }

        nav.month button{
          width:28px;
          height:28px;
          border-radius:8px;
          border:1px solid var(--fs-border);
          background:#fff;
          cursor:pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fs-muted);
        }
        nav.month button:hover{ background:rgba(24,168,97,0.08); color: var(--fs-accent); }

        ol.dow{
          list-style:none;
          margin:0 0 8px;
          padding:0;
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:4px;
          color:var(--fs-muted);
          font-weight:600;
          font-size:11px;
          text-transform:uppercase;
          text-align: center;
        }

        ol.grid{
          list-style:none;
          margin:0;
          padding:0;
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:4px;
        }

        .cell{
          display:grid;
          place-items:center;
          height:32px;
          border-radius:8px;
          border:1px solid transparent;
          background:#fff;
          cursor:pointer;
          font-weight:500;
          color:var(--fs-text);
          width:100%;
          font-size: 0.9rem;
          padding: 0;
        }

        li.cell.cell--empty{
          height:32px;
          background:transparent;
        }

        .cell:hover{ background:rgba(24,168,97,0.1); color: var(--fs-accent); }
        
        .cell--selected {
            background: var(--fs-accent);
            color: #fff;
        }

        .cell--start {
            background: var(--fs-accent);
            color: #fff;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .cell--end {
            background: var(--fs-accent);
            color: #fff;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .cell--in-range {
            background: rgba(24,168,97,0.15);
            color: var(--fs-accent);
            border-radius: 0;
        }

      </style>

      <aside aria-label="Filter sidebar">
        <header>
          <fieldset aria-label="Төрөл">
            <legend>Төрөл</legend>

            <label class="radio">
              <input type="radio" name="fs-type" value="lost" ${this.state.type === "lost" ? "checked" : ""
      } />
              <span>Хаясан</span>
            </label>

            <label class="radio">
              <input type="radio" name="fs-type" value="found" ${this.state.type === "found" ? "checked" : ""
      } />
              <span>Олсон</span>
            </label>
          </fieldset>

          <button class="clear" type="button" data-action="clear">Цэвэрлэх</button>
        </header>

        <section aria-label="Байршлын шүүлтүүр">
          <h3>Хаана</h3>
          <select name="fs-location" class="location-select" aria-label="Байршил сонгох">
            ${locOptions}
          </select>
        </section>

        <section class="calendar" aria-label="Огнооны шүүлтүүр">
          <h3>Хэзээ</h3>
          <article aria-label="Calendar widget">
            <nav class="month" aria-label="Сар сонгох">
              <button type="button" data-action="prev-month" aria-label="Өмнөх сар">❮</button>
              <strong>${monthName}</strong>
              <button type="button" data-action="next-month" aria-label="Дараагийн сар">❯</button>
            </nav>

            <ol class="dow" aria-hidden="true">
              <li>Да</li><li>Мя</li><li>Лх</li><li>Пү</li><li>Ба</li><li>Бя</li><li>Ня</li>
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
