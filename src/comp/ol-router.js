import { HomePage } from '../pages/home.js';
import { AddPage } from '../pages/add.js';
import { LoginPage } from '../pages/login.js';
import { RegisterPage } from '../pages/register.js';

function router() {
    const app = document.getElementById('app');
    let path = location.hash.slice(1) || '/';
    
    if (path.startsWith('/')) {
        path = path.slice(1);
    }

    let view;

    switch (path) {
        case '':
        case '/':
            view = HomePage;
            break;
        case 'add':
        case 'add-ad':
            view = AddPage;
            break;
        case 'login':
            view = LoginPage;
            break;
        case 'register':
        case 'signup':
            view = RegisterPage;
            break;
        default:
            view = HomePage;
    }

    app.innerHTML = view();
}


window.addEventListener('hashchange', router);

router();