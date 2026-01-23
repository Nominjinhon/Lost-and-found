export function LoginPage() {
  return `
    <main-header></main-header>
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

          <button type="submit" class="btn-submit">Нэвтрэх</button>
        </fieldset>
      </form>
      
      <footer class="form-footer">
        <p>Бүртгэл байхгүй юу? <a href="#register">Бүртгүүлэх</a></p>
      </footer>
    </article>
    </div>
  `;
}
