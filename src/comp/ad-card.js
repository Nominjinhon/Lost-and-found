class AdCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const image = this.getAttribute('image') || '../images/backpack.png';
        const alt = this.getAttribute('alt') || 'Зураг';
        const date = this.getAttribute('date') || '';
        const location = this.getAttribute('location') || '';
        const status = this.getAttribute('status') || 'lost'; // 'lost' or 'found'
        const id = this.getAttribute('id') || 'ad-default';

        const statusClass = status === 'found' ? 'green' : 'red';
        const statusText = status === 'found' ? 'Олсон' : 'Хайж байна';

        this.innerHTML = `
        <article class="card" aria-labelledby="${id}">
          <button class="bookmark" aria-label="Нэмэх дуртай">☆</button>
          <figure class="thumb" role="img" aria-label="Зураг">
            <img src="${image}" alt="${alt}">
          </figure>
          <h3 id="${id}" class="card-title"><span class="status-dot ${statusClass}" aria-hidden="true">●</span> ${title}</h3>
          <p class="meta">${date}</p>
          <time datetime="${date}">${location}</time>
        </article>
        `;
    }
}

window.customElements.define('ad-card', AdCard);
