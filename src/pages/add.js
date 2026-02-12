import { api } from "../api.js";

const renderHtml = () => `
    <main-header></main-header>
    <div class="container">
      <article class="add-page">
        <header class="add-header">
          <h1 class="add-title">Зар нэмэх</h1>
          <p class="add-subtitle">Алдсан эсвэл олсон эд зүйлээ бүртгэнэ үү</p>
        </header>

        <form class="ad-form" id="adForm" novalidate>
          <section class="tabs" role="tablist" aria-label="Зарын төрөл">
            <button type="button" role="tab" aria-selected="true" id="tab-lost" class="tab tab--active" data-value="lost">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Хаясан</span>
            </button>
            <button type="button" role="tab" aria-selected="false" id="tab-found" class="tab" data-value="found">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Олсон</span>
            </button>
          </section>
          <div class="form-card">
            <section class="form-section">
              <h2 class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Эд зүйлийн мэдээлэл
              </h2>

              <div class="form-row">
                <label for="itemName">Эд зүйлын нэр <span class="required">*</span></label>
                <input id="itemName" name="title" type="text" placeholder="Жишээ: iPhone 15 Pro Max" required />
              </div>

              <div class="form-row">
                <label for="typeSelect">Төрөл <span class="required">*</span></label>
                <select id="typeSelect" name="type" required>
                  <option value="">Төрөл сонгох</option>
                  <option value="Гар утас">📱 Гар утас</option>
                  <option value="Түрийвч">👛 Түрийвч</option>
                  <option value="Түлхүүр">🔑 Түлхүүр</option>
                  <option value="Цүнх">🎒 Цүнх</option>
                  <option value="Бичиг баримт">📄 Бичиг баримт</option>
                  <option value="Цаг">⌚ Цаг</option>
                  <option value="Бусад">📦 Бусад</option>
                </select>
              </div>

              <div class="form-row">
                <label for="description" id="label-description">Тайлбар <span class="required">*</span></label>
                <textarea id="description" name="description" rows="4" placeholder="Эд зүйлийн өнгө, хэмжээ, онцлог шинж зэргийг бичнэ үү..." required></textarea>
              </div>

               <div class="form-row">
                <label for="image">Зураг</label>
                <input id="image" name="image" type="file" accept="image/*" />
              </div>
            </section>

            <section class="form-section">
              <h2 class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Байршил ба огноо
              </h2>

              <div class="form-grid">
                <div class="form-row">
                  <label for="location" id="label-location">Байршил <span class="required">*</span></label>
                  <ol-location-select id="location" name="location" required></ol-location-select>
                </div>

                <div class="form-row">
                  <label for="date" id="label-date">Огноо <span class="required">*</span></label>
                  <input id="date" name="date" type="date" required />
                </div>
              </div>
            </section>

            
            <section class="form-section">
              <h2 class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span id="label-features-title">Онцлог шинж</span>
              </h2>

              <div class="form-row">
                <label for="features" id="label-features">Онцлог шинж тэмдэг</label>
                <input id="features" name="features" type="text" placeholder="Жишээ: Хар өнгөтэй, зураастай, наалттай..." />
              </div>
              <p class="help-text" id="help-features">Эд зүйлийн онцлог шинж тэмдгүүдийг бичнэ үү</p>
            </section>
            
          
            <section class="form-section" id="section-contact">
              <h2 class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Холбоо барих
              </h2>

              <div class="form-row">
                <label for="contact">Утасны дугаар <span class="required">*</span></label>
                <input id="contact" name="contact" type="tel" placeholder="99112233" required />
              </div>
            </section>

           
            <section class="form-section" id="section-ad-type">
              <h2 class="section-title">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Зарын төрөл
              </h2>

              <div class="ad-type-options">
                <label class="ad-type-card">
                  <input type="radio" name="category" value="urgent" />
                  <div class="ad-type-content">
                    <span class="ad-type-badge urgent">Яаралтай</span>
                    <span class="ad-type-price">10,000₮</span>
                    <span class="ad-type-desc">Хамгийн дээд байрлалд</span>
                  </div>
                </label>

                <label class="ad-type-card selected">
                  <input type="radio" name="category" value="recent" checked />
                  <div class="ad-type-content">
                    <span class="ad-type-badge normal">Энгийн</span>
                    <span class="ad-type-price">Үнэгүй</span>
                    <span class="ad-type-desc">Ердийн байрлалд</span>
                  </div>
                </label>
              </div>
            </section>

            <div id="add-error" class="error-message" style="color: red; margin-bottom: 1rem; display: none;"></div>

         
            <footer class="form-actions">
              <button type="reset" class="btn btn--ghost">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Цуцлах
              </button>
              <button type="submit" class="btn btn--primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Зар оруулах
              </button>
            </footer>
          </div>
        </form>
      </article>
    </div>
    <main-footer></main-footer>
`;

const updateFormUI = (status, elements) => {
  const isFound = status === "found";
  const {
    titleEl,
    subtitleEl,
    descLabel,
    descInput,
    locLabel,
    dateLabel,
    featTitle,
    featLabel,
    helpFeat,
    adTypeSection,
    contactSection,
  } = elements;

  if (titleEl)
    titleEl.textContent = isFound
      ? "Олсон зүйл бүртгэх"
      : "Гээсэн зүйл бүртгэх";
  if (subtitleEl)
    subtitleEl.textContent = isFound
      ? "Олсон эд зүйлийнхээ талаар дэлгэрэнгүй мэдээлэл оруулна уу"
      : "Алдсан эд зүйлийнхээ талаар дэлгэрэнгүй мэдээлэл оруулна уу";

  if (descLabel)
    descLabel.innerHTML = isFound
      ? "Олсон нөхцөл байдал <span class='required'>*</span>"
      : "Тайлбар <span class='required'>*</span>";
  if (descInput)
    descInput.placeholder = isFound
      ? "Хаанаас, ямар байдалтай олсон тухайгаа бичнэ үү..."
      : "Эд зүйлийн өнгө, хэмжээ, онцлог шинж зэргийг бичнэ үү...";

  if (locLabel)
    locLabel.innerHTML = isFound
      ? "Олсон байршил <span class='required'>*</span>"
      : "Гээсэн байршил <span class='required'>*</span>";
  if (dateLabel)
    dateLabel.innerHTML = isFound
      ? "Олсон огноо <span class='required'>*</span>"
      : "Гээсэн огноо <span class='required'>*</span>";

  if (featTitle)
    featTitle.textContent = isFound ? "Таньж мэдэх тэмдэг" : "Онцлог шинж";
  if (featLabel)
    featLabel.textContent = isFound
      ? "Нууц тэмдэг (Эзэмшигчийг шалгахад ашиглагдана)"
      : "Онцлог шинж тэмдэг";
  if (helpFeat)
    helpFeat.textContent = isFound
      ? "Эзэмшигч нь л мэдэх боломжтой нууц тэмдэг, содон шинж (Жишээ: Дэлгэцийн зураг, Case доторх бичиг)"
      : "Эд зүйлийн онцлог шинж тэмдгүүдийг бичнэ үү";

  if (adTypeSection) {
    adTypeSection.style.display = isFound ? "none" : "block";
  }
  if (isFound) {
    const recentRadio = document.querySelector(
      'input[name="category"][value="recent"]',
    );
    if (recentRadio) {
      recentRadio.checked = true;
      document
        .querySelectorAll(".ad-type-card")
        .forEach((c) => c.classList.remove("selected"));
      const card = recentRadio.closest(".ad-type-card");
      if (card) card.classList.add("selected");
    }
  }

  if (contactSection) {
    contactSection.style.borderBottom = isFound ? "none" : "";
    contactSection.style.marginBottom = isFound ? "0" : "";
    contactSection.style.paddingBottom = isFound ? "0" : "";
  }
};

const handleFormSubmit = async (e, form, user, currentStatus, errorMsg) => {
  e.preventDefault();
  errorMsg.style.display = "none";
  errorMsg.textContent = "";

  const formData = new FormData(form);
  formData.append("status", currentStatus);

  const requiredFields = [
    "title",
    "description",
    "location",
    "date",
    "contact",
    "type",
  ];
  const missingField = requiredFields.find((field) => !formData.get(field));

  if (missingField) {
    errorMsg.textContent = "Та бүх шаардлагатай талбарыг бөглөнө үү.";
    errorMsg.style.display = "block";
    return;
  }

  try {
    await api.createAd(formData, user.token);
    window.location.hash = "#";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.style.display = "block";
  }
};

const initPage = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      window.location.hash = "#login";
      return;
    }
    const user = JSON.parse(userStr);

    const elements = {
      titleEl: document.querySelector(".add-title"),
      subtitleEl: document.querySelector(".add-subtitle"),
      descLabel: document.getElementById("label-description"),
      descInput: document.getElementById("description"),
      locLabel: document.getElementById("label-location"),
      dateLabel: document.getElementById("label-date"),
      featTitle: document.getElementById("label-features-title"),
      featLabel: document.getElementById("label-features"),
      helpFeat: document.getElementById("help-features"),
      adTypeSection: document.getElementById("section-ad-type"),
      contactSection: document.getElementById("section-contact"),
    };

    const tabs = document.querySelectorAll(".tab");
    let currentStatus = "lost";

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.remove("tab--active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("tab--active");
        tab.setAttribute("aria-selected", "true");
        currentStatus = tab.dataset.value;
        updateFormUI(currentStatus, elements);
      });
    });

    updateFormUI(currentStatus, elements);

    const adTypeCards = document.querySelectorAll(".ad-type-card");
    adTypeCards.forEach((card) => {
      card.addEventListener("click", () => {
        adTypeCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });

    const form = document.getElementById("adForm");
    const errorMsg = document.getElementById("add-error");

    if (form) {
      form.addEventListener("submit", (e) =>
        handleFormSubmit(e, form, user, currentStatus, errorMsg),
      );
    }
  } catch (err) {
    console.error("Add Page Init Error:", err);
  }
};

export function AddPage() {
  setTimeout(initPage, 0);
  return renderHtml();
}
