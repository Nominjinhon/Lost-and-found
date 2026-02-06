import { api } from "../api.js";

export function RegisterPage() {
  const html = `
    <div class="container">
    <section class="register-page">
      <article class="form-box">
        <header>
          <h1>Бүртгэл үүсгэх</h1>
        </header>
        
        <form id="register-form">
          <fieldset>
            <legend class="visually-hidden">Бүртгэлийн мэдээлэл</legend>
            
            <label for="lastname">Овог, нэр</label>
            <input type="text" id="lastname" name="lastname" placeholder="Овог, нэрээ оруулна уу" required>

            <label for="phone">Утасны дугаар</label>
            <input type="tel" id="phone" name="phone" placeholder="Утасны дугаараа оруулна уу" required>

            <label for="password">Нууц үг</label>
            <input type="password" id="password" name="password" placeholder="Нууц үгээ оруулна уу" required>

            <label for="confirm-password">Нууц үг давтах</label>
            <input type="password" id="confirm-password" name="confirm-password" placeholder="Нууц үгээ давтан оруулна уу" required>

            <label class="checkbox-label">
              <input type="checkbox" id="terms" name="terms" required>
              <span>Үйлчилгээний нөхцөл зөвшөөрөх</span>
            </label>

            <div id="register-error" class="error-message" style="color: red; margin-bottom: 1rem; display: none;"></div>

            <button type="submit" class="btn btn--primary">Бүртгүүлэх</button>

            <footer class="form-footer">
              <a href="#login">Нэвтрэх</a>
            </footer>
          </fieldset>
        </form>
      </article>
    </section>
    </div>
  `;

  setTimeout(() => {
    const form = document.getElementById("register-form");
    const errorMsg = document.getElementById("register-error");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMsg.style.display = "none";
        errorMsg.textContent = "";

        const formData = new FormData(form);
        const name = formData.get("lastname");
        const phone = formData.get("phone");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");

        if (password !== confirmPassword) {
          errorMsg.textContent = "Нууц үг таарахгүй байна";
          errorMsg.style.display = "block";
          return;
        }

        try {
          const data = await api.register({ name, phone, password });

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
