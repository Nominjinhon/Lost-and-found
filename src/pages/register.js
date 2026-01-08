export function RegisterPage() {
  return `
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

            <button type="submit" class="btn btn--primary">Бүртгүүлэх</button>

            <a href="#" class="google-btn">
              <img src="https://www.google.com/favicon.ico" alt="Google">
              <span>Google</span>
            </a>

            <footer class="form-footer">
              <a href="#login">Нэвтрэх</a>
            </footer>
          </fieldset>
        </form>
      </article>
    </section>
  `;
}

