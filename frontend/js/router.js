
const Router = (() => {
  const routes = {};
  let currentRoute = null;

  function register(hash, { viewId, onEnter, onLeave, requiresAuth = false }) {
    routes[hash] = { viewId, onEnter, onLeave, requiresAuth };
  }

  function navigate(hash) {
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      handleRouteChange();
    }
  }

  function handleRouteChange() {
    const hash = window.location.hash || '#/auth';
    const route = routes[hash];

    if (!route) {
      navigate('#/auth');
      return;
    }

    if (route.requiresAuth && !TokenStore.isLoggedIn()) {
      navigate('#/auth');
      return;
    }

    if (hash === '#/auth' && TokenStore.isLoggedIn()) {
      navigate('#/chat');
      return;
    }

    if (currentRoute && routes[currentRoute] && routes[currentRoute].onLeave) {
      routes[currentRoute].onLeave();
    }

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    const viewEl = document.getElementById(route.viewId);
    if (viewEl) {
      viewEl.classList.add('active');
    }

    document.querySelectorAll('.nav-btn[data-route]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === hash);
    });

    const header = document.getElementById('app-header');

    if (header) {
      header.style.display = hash === '#/auth' ? 'none' : 'flex';
    }

    currentRoute = hash;

    if (route.onEnter) {
      route.onEnter();
    }
  }

  function init() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
  }

  return { register, navigate, init };
})();

window.Router = Router;
