class AdCard extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['title', 'image', 'alt', 'date', 'location', 'status', 'id'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const id = this.getAttribute('id') || 'ad-default';
        const title = this.getAttribute('title') || '';
        const image = this.getAttribute('image') || '../images/backpack.png';
        const alt = this.getAttribute('alt') || 'Зураг';
        const date = this.getAttribute('date') || '';
        const location = this.getAttribute('location') || '';
        const status = this.getAttribute('status') || 'lost';

        const statusClass = status === 'found' ? 'green' : 'red';

        this.innerHTML = `
        <article class="card" aria-labelledby="${id}">
          <input type="checkbox" id="${id}-bookmark" class="bookmark-toggle" aria-label="Нэмэх дуртай" />
          <label class="bookmark-label" for="${id}-bookmark" aria-hidden="true"></label>
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
