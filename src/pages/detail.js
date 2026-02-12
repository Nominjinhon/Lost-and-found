import { api } from "../api.js";

export function DetailPage(adId) {
  return `
    <main-header></main-header>
    <div class="container" id="detail-container">
      <div class="loading" style="text-align: center; padding: 4rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <p>Ачаалж байна...</p>
      </div>
    </div>
    <main-footer></main-footer>
    <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
  `;
}

export async function initDetailPage(adId) {
  const container = document.getElementById("detail-container");
  if (!container) return;

  try {
    const ad = await api.getAd(adId);
    renderDetailView(container, ad);
    attachDetailListeners(ad);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
        <article class="detail-page">
          <div class="not-found">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h1>Зар олдсонгүй</h1>
            <p>Уучлаарай, таны хайсан зар олдсонгүй эсвэл алдаа гарлаа.</p>
            <p class="error-msg">${error.message}</p>
            <a href="#/" class="btn btn--primary">Нүүр хуудас руу буцах</a>
          </div>
        </article>
      `;
  }
}

function renderDetailView(container, ad) {
  const statusClass = ad.status === "found" ? "found" : "lost";
  const statusText = ad.status === "found" ? "Олсон" : "Хайж байна";
  const dateDisplay = new Date(ad.date).toLocaleDateString("mn-MN");
  const imageSrc = ad.image
    ? ad.image.startsWith("http")
      ? ad.image
      : `http://localhost:5000/${ad.image}`
    : "images/backpack.png";

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isOwner = user && (user._id === ad.user || user.id === ad.user);

  container.innerHTML = `
      <article class="detail-page">
        
        <a href="#/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Буцах</span>
        </a>

        <div class="detail-layout">
          <div class="detail-image-section">
            <figure class="detail-image">
              <img src="${imageSrc}" alt="${ad.title}" />
            </figure>
          </div>

        
          <div class="detail-info-section">
            <div class="detail-header">
              <div class="header-badges">
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${isOwner ? '<span class="owner-badge">Таны зар</span>' : ""}
              </div>
              <button class="bookmark-btn" aria-label="Хадгалах">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                </svg>
              </button>
            </div>

            <h1 class="detail-title">${ad.title}</h1>

            <div class="detail-meta">
              <div class="meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${dateDisplay}</span>
              </div>
              <div class="meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${ad.location}</span>
              </div>
            </div>

            <div class="detail-section">
              <h2>Тайлбар</h2>
              <p class="detail-description">
                ${ad.description || "Нэмэлт тайлбар оруулаагүй байна."}
              </p>
            </div>

            <div class="detail-section">
              <h2>Төрөл</h2>
              <span class="category-tag">${ad.type || "Бусад"}</span>
            </div>

            <div class="detail-actions">
              ${
                isOwner
                  ? `
                  <button class="btn btn--outline-danger delete-btn" data-ad-id="${ad._id}" style="border: 1px solid #ef4444; color: #ef4444; background: transparent; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 500; cursor: pointer;">Устгах</button>
                  `
                  : `
              <button class="btn btn--primary report-btn" data-ad-id="${ad._id}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Мэдээлэх
              </button>
              ${
                ad.contact
                  ? `
              <a href="tel:${ad.contact}" class="btn btn--ghost">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Холбоо барих
              </a>`
                  : ""
              }
              `
              }
            </div>

            <div class="detail-posted">
              <span>Нийтэлсэн: ${new Date(ad.createdAt || ad.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </article>

      <div class="claim-modal" id="claimModal">
        <div class="claim-modal-overlay"></div>
        <div class="claim-modal-content">
          <button class="claim-modal-close" id="closeClaimModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="claim-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2>Эд зүйлээ баталгаажуулах</h2>
            <p>Энэ эд зүйл танийх болохыг баталгаажуулахын тулд дараах мэдээллийг бөглөнө үү</p>
          </div>

          <form class="claim-form" id="claimForm">
            <div class="form-row">
              <label for="claimDescription">Эд зүйлийн тодорхойлолт <span class="required">*</span></label>
              <textarea id="claimDescription" name="description" rows="3" placeholder="Эд зүйлийнхээ онцлог шинжийг дэлгэрэнгүй бичнэ үү..."></textarea>
            </div>

            <div class="form-row">
              <label for="claimFeatures">Онцлог шинж тэмдэг <span class="required">*</span></label>
              <input id="claimFeatures" name="features" type="text" placeholder="Жишээ: Наалттай, зураастай, хар гэртэй..." />
            </div>

            <div class="form-grid">
              <div class="form-row">
                <label for="claimDate">Алдсан/Олсон огноо</label>
                <input id="claimDate" name="date" type="date" />
              </div>
              <div class="form-row">
                <label for="claimLocation">Байршил</label>
                <input id="claimLocation" name="location" type="text" placeholder="Хаана алдсан/олсон..." />
              </div>
            </div>

            <div class="form-row">
              <label for="claimContact">Холбоо барих <span class="required">*</span></label>
              <input id="claimContact" name="contact" type="tel" placeholder="Утасны дугаар" />
            </div>

            <div class="claim-actions">
              <button type="button" class="btn btn--ghost" id="cancelClaim">Цуцлах</button>
              <button type="submit" class="btn btn--primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Баталгаажуулах
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
}

function attachDetailListeners(ad) {
  const reportBtn = document.querySelector(".report-btn");
  const claimModal = document.getElementById("claimModal");
  const closeBtn = document.getElementById("closeClaimModal");
  const cancelBtn = document.getElementById("cancelClaim");
  const overlay = document.querySelector(".claim-modal-overlay");
  const claimForm = document.getElementById("claimForm");

  function openModal() {
    if (claimModal) claimModal.classList.add("active");
  }

  function closeModal() {
    if (claimModal) claimModal.classList.remove("active");
  }

  if (reportBtn) reportBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  const bookmarkBtn = document.querySelector(".bookmark-btn");
  if (bookmarkBtn) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const token = JSON.parse(userStr).token;
      api
        .getMe(token)
        .then((u) => {
          const savedList = u.savedAds || [];
          const isSaved = savedList.some((item) =>
            typeof item === "object" ? item._id === ad._id : item === ad._id,
          );
          if (isSaved) {
            bookmarkBtn.classList.add("saved");
            bookmarkBtn.querySelector("svg").style.fill = "currentColor";
          }
        })
        .catch(console.error);

      bookmarkBtn.addEventListener("click", async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user) {
            alert("Та нэвтрэх шаардлагатай");
            return;
          }

          bookmarkBtn.disabled = true;
          const res = await api.toggleBookmark(ad._id, user.token);

          const isSaved = res.includes(ad._id);
          if (isSaved) {
            bookmarkBtn.classList.add("saved");
            bookmarkBtn.querySelector("svg").style.fill = "currentColor";
          } else {
            bookmarkBtn.classList.remove("saved");
            bookmarkBtn.querySelector("svg").style.fill = "none";
          }
        } catch (err) {
          alert(err.message);
        } finally {
          bookmarkBtn.disabled = false;
        }
      });
    }
  }

  const deleteBtn = document.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const adId = deleteBtn.dataset.adId;
      if (confirm("Та энэ зарыг устгахдаа итгэлтэй байна уу?")) {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const token = JSON.parse(userStr).token;

        deleteBtn.disabled = true;
        deleteBtn.textContent = "Устгаж байна...";

        try {
          await api.deleteAd(adId, token);
          alert("Зар амжилттай устгагдлаа");
          window.location.hash = "#profile";
        } catch (e) {
          alert("Алдаа: " + e.message);
          deleteBtn.disabled = false;
          deleteBtn.textContent = "Устгах";
        }
      }
    });
  }

  if (claimForm) {
    claimForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(claimForm);
      const data = Object.fromEntries(formData);

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Та нэвтрэх шаардлагатай");
        return;
      }
      const user = JSON.parse(userStr);

      const submitBtn = claimForm.querySelector("button[type=submit]");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = "Илгээж байна...";

      try {
        await api.createNotification(
          {
            adId: ad._id,
            message: data.description,
            contactInfo: {
              description: data.description,
              features: data.features,
              date: data.date,
              location: data.location,
              contact: data.contact,
            },
          },
          user.token,
        );

        claimModal.innerHTML = `
              <div class="claim-modal-content claim-success">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#18a861" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h2>Амжилттай илгээгдлээ!</h2>
                <p>Таны мэдээлэл амжилттай илгээгдлээ. Бид тантай удахгүй холбогдох болно.</p>
                <button class="btn btn--primary" onclick="document.getElementById('claimModal').classList.remove('active')">Хаах</button>
              </div>
            `;
      } catch (err) {
        console.error(err);
        alert("Алдаа: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
}
