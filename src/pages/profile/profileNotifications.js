import { api } from "../../api.js";

export async function loadNotifications(token) {
  const container = document.getElementById("notifications-container");
  if (!container) return;

  try {
    const notifs = await api.getMyNotifications(token);

    if (notifs.length === 0) {
      container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--muted);">
                    <p>Танд одоогоор мэдэгдэл ирээгүй байна.</p>
                </div>`;
      return;
    }

    container.innerHTML = `<div class="notification-list">
            ${notifs
              .map((n) => {
                const isVerified = n.isVerified;
                const isRejected = n.isRejected;
                const isResponse =
                  n.type === "claim_verified" || n.type === "claim_rejected";
                const contact = n.contactInfo || {};
                const dateDisplay = new Date(n.createdAt).toLocaleDateString(
                  "mn-MN",
                );

                return `
                <article class="notification-card ${n.status}">
                    <div class="notif-header">
                        <div>
                            <h3 class="notif-title">${n.message}</h3>
                            <div class="notif-date">${dateDisplay}</div>
                        </div>
                    </div>

                    <div class="notif-body">
                        <div class="notif-ref">
                            <span>Холбогдох зар:</span>
                            ${
                              n.ad
                                ? `<a href="#detail/${n.ad._id}">${n.ad.title}</a>`
                                : `<span class="deleted-ad">Устгагдсан зар</span>`
                            }
                        </div>
                        
                        ${
                          !isResponse && contact.description
                            ? `
                        <div class="claim-details">
                            <div class="detail-row">
                                <span class="detail-label">Тайлбар:</span>
                                <span class="detail-value">${contact.description || "-"}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Онцлог:</span>
                                <span class="detail-value">${contact.features || "-"}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Байршил:</span>
                                <span class="detail-value">${contact.location || "-"}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Холбоо барих:</span>
                                <span class="detail-value"><a href="tel:${contact.contact}">${contact.contact}</a></span>
                            </div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                
                    <div class="notif-actions">
                        ${
                          n.type === "claim_verified"
                            ? `<div class="response-badge verified">
                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                 Баталгаажсан
                               </div>`
                            : n.type === "claim_rejected"
                              ? `<div class="response-badge rejected">
                                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                   Цуцлагдсан
                                 </div>`
                              : isVerified
                                ? `<div class="verify-badge">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                     Баталгаажсан
                                   </div>`
                                : n.isRejected
                                  ? `<div class="verify-badge rejected">
                                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                       Цуцлагдсан
                                     </div>`
                                  : `<button class="btn btn--outline-danger reject-btn" data-id="${n._id}">
                                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                       Цуцлах
                                     </button>
                                     <button class="btn btn--primary verify-btn" data-id="${n._id}">
                                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                       Баталгаажуулах
                                     </button>`
                        }
                    </div>
                </article>
                `;
              })
              .join("")}
        </div>`;

    container.querySelectorAll(".verify-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Энэ мэдээллийг зөв гэж баталгаажуулах уу?")) return;

        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = "Уншиж байна...";

        try {
          await api.verifyClaim(id, token);
          loadNotifications(token);
        } catch (e) {
          alert(e.message);
          btn.disabled = false;
          btn.textContent = "Баталгаажуулах";
        }
      });
    });

    container.querySelectorAll(".reject-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Энэ мэдээллийг цуцлах уу?")) return;

        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = "Уншиж байна...";

        try {
          await api.rejectClaim(id, token);
          loadNotifications(token);
        } catch (e) {
          alert(e.message);
          btn.disabled = false;
          btn.textContent = "Цуцлах";
        }
      });
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = `<p class="error">Алдаа: ${e.message}</p>`;
  }
}
