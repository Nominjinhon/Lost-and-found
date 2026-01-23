import { HomePage } from '../pages/home.js';
import { AddPage } from '../pages/add.js';
import { LoginPage } from '../pages/login.js';
import { RegisterPage } from '../pages/register.js';
import { ProfilePage } from '../pages/profile.js';

class OlRouter extends HTMLElement {
  connectedCallback() {
    this.loadRoute();
    // url uurchlugduh bolgond loadRoute ajillana
    window.addEventListener('hashchange', () => this.loadRoute());
  }

  loadRoute() {
    const hash = window.location.hash.replace('#', '');
    const [page] = hash.split('?');
    const app = document.getElementById('app');

    let view;

    switch (page) {
      case '':
      case '/':
        view = HomePage;
        break;
      case 'add':
      case '/add':
      case 'add-ad':
      case '/add-ad':
        view = AddPage;
        break;
      case 'login':
      case '/login':
        view = LoginPage;
        break;
      case 'register':
      case '/register':
      case 'signup':
      case '/signup':
        view = RegisterPage;
        break;
      case 'profile':
      case '/profile':
        view = ProfilePage;
        break;
      default:
        view = HomePage;
    }

    if (app) app.innerHTML = view();
  }
}

customElements.define('ol-router', OlRouter);
