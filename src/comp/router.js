
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  init() {
    
    this.handleRoute();
    
    
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    
    if (this.currentRoute !== hash) {
      this.currentRoute = hash;
      const handler = this.routes[hash];
      if (handler) {
        handler();
      } else {
        this.currentRoute = 'home';
        const homeHandler = this.routes['home'];
        if (homeHandler) homeHandler();
      }
    }
  }
}

window.router = new Router();


window.router.register('home', () => {
  showSection('main-content');
});

window.router.register('my-ads', () => {
  showSection('my-ads-section');
});

window.router.register('add-ad', () => {
  showSection('add-ad-section');
});

function showSection(sectionId) {
  
  const sections = document.querySelectorAll('[data-route-section]');
  sections.forEach(sec => {
    sec.style.display = 'none';
  });
  
  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = 'block';
  }
}

// Initialize router on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.router.handleRoute();
  });
} else {
  window.router.handleRoute();
}
