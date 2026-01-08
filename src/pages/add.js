export function AddPage() {
  return `
    <article class="add-page">
      <header>
        <h1 class="page-title">Зар оруулах</h1>
        <p class="lead">Эд зүйлийн талаарх нарийн мэдээлэл оруулна уу!</p>
      </header>

    <form class="ad-form" id="adForm" action="#" method="post" novalidate>
      <!-- Tabs (semantic: role="tablist") -->
      <div class="tabs" role="tablist" aria-label="Зарын төрөл">
        <button type="button"
                role="tab"
                aria-selected="true"
                id="tab-lost"
                class="tab tab--active">Хаясан</button>

        <button type="button"
                role="tab"
                aria-selected="false"
                id="tab-found"
                class="tab">Олсон</button>
      </div>

      <fieldset class="card">
        <legend class="visually-hidden">Зарны дэлгэрэнгүй</legend>

        <div class="form-row">
          <label for="itemName">Эд зүйлын нэр</label>
          <input id="itemName" name="itemName" type="text" placeholder="Жишээ: Утас, түлхүүр..." />
        </div>

        <div class="form-row">
          <label for="typeSelect">Төрөл</label>
          <select id="typeSelect" name="type">
            <option value="">Төрөл сонгох</option>
            <option value="phone">Утас</option>
            <option value="keys">Түлхүүр</option>
            <option value="wallet">Төсөв/Цүнх</option>
            <option value="other">Бусад</option>
          </select>
        </div>

        <div class="form-grid">
          <div class="form-row">
            <label for="location">Байршил</label>
            <input id="location" name="location" type="text" placeholder="Улаанбаатар, СХД..." />
          </div>

          <div class="form-row">
            <label for="date">Хугацаа</label>
            <input id="date" name="date" type="date" />
          </div>
        </div>

        <div class="form-row">
          <label for="description">Тайлбар</label>
          <textarea id="description" name="description" rows="3" placeholder="Нэмэлт мэдээлэл..."></textarea>
        </div>

        <fieldset class="checkboxes" aria-label="Онцгой шинж тэмдэг">
          <legend class="legend">Онцгой шинж тэмдэг</legend>
          <label><input type="checkbox" name="feat" value="1" /> Сонголт 1</label>
          <label><input type="checkbox" name="feat" value="2" /> Сонголт 2</label>
          <label><input type="checkbox" name="feat" value="3" /> Сонголт 3</label>
        </fieldset>

        <!-- Шагнал (dual-range simulation using two ranges + JS) -->
        <div class="form-row">
          <label class="legend">Шагнал</label>
          <div class="range-wrap">
            <div class="active-track"></div>
            <input type="range" id="rangeMin" name="reward_min" min="0" max="200000" step="1000" value="50000" />
            <input type="range" id="rangeMax" name="reward_max" min="0" max="200000" step="1000" value="100000" />
            <div class="range-values">
              <span id="rangeMinVal">50,000</span>
              <span id="rangeMaxVal">100,000</span>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-row">
            <label for="contact">Холбоо барих мэдээлэл</label>
            <input id="contact" name="contact" type="text" placeholder="Утас / имэйл..." />
          </div>

          <div class="form-row align-center">
            <label class="inline"><input type="checkbox" name="hideContact" /> Нуух</label>
          </div>
        </div>

        <fieldset class="checkboxes" aria-label="Зарын төрөл">
          <legend class="legend">Зарын төрөл</legend>
          <label><input type="radio" name="ad_type" value="urgent" /> Яаралтай (10,000)</label>
          <label><input type="radio" name="ad_type" value="special" /> Тусгай (5,000)</label>
          <label><input type="radio" name="ad_type" value="normal" checked /> Энгийн (0)</label>
        </fieldset>

        <div class="form-actions">
          <button type="reset" class="btn btn--ghost">Цуцлах</button>
          <button type="submit" class="btn btn--primary">Оруулах</button>
        </div>
      </fieldset>
    </form>
    </article>
  `;
}
