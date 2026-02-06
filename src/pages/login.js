import { api } from "../api.js";

export function LoginPage() {
  const html = `
    <div class="container">
    <article class="login-page">
      <header>
        <h1>Тавтай морил</h1>
      </header>
      
      <form id="login-form" class="login-form">
        <fieldset>
          <legend class="visually-hidden">Нэвтрэх мэдээлэл</legend>
          
          <label for="PhoneNumber">Утасны дугаар</label>
          <input type="tel" id="PhoneNumber" name="PhoneNumber" required>

          <label for="Password">Нууц үг</label>
          <input type="password" id="Password" name="Password" required>

          <label class="checkbox-label">
            <input type="checkbox" id="RememberMe" name="RememberMe">
            <span>Сануулах</span>
          </label>

          <div id="login-error" class="error-message" style="color: red; margin-bottom: 1rem; display: none;"></div>

          <button type="submit" class="btn-submit">Нэвтрэх</button>
        </fieldset>
      </form>
      
      <footer class="form-footer">
        <p>Бүртгэл байхгүй юу? <a href="#register">Бүртгүүлэх</a></p>
      </footer>
    </article>
    </div>
  `;

  setTimeout(() => {
    const form = document.getElementById("login-form");
    const errorMsg = document.getElementById("login-error");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMsg.style.display = "none";
        errorMsg.textContent = "";

        const formData = new FormData(form);
        const phone = formData.get("PhoneNumber");
        const password = formData.get("Password");

        try {
          const data = await api.login({ phone, password });

          localStorage.setItem("user", JSON.stringify(data));

          window.location.hash = "#";
        } catch (err) {
          errorMsg.textContent = err.message;
          errorMsg.style.display = "block";
        }
      });
    }
  }, 0);

  return html;
}
