/* ═══════════════════════════════════════════════════════
   APP — Entry Point & Initialization
   ═══════════════════════════════════════════════════════ */

// ── Global Helpers ──

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function formatPrice(price) {
  if (price == null) return '-';
  return Number(price).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatNumber(num) {
  if (num == null) return '-';
  return Number(num).toLocaleString('es-AR');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 300ms';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── App Init ──

document.addEventListener('DOMContentLoaded', () => {
  // Initialize views
  AuthView.init();
  ChatView.init();
  CatalogView.init();

  // Register routes
  Router.register('#/auth', {
    viewId: 'auth-view',
    requiresAuth: false,
  });

  Router.register('#/chat', {
    viewId: 'chat-view',
    requiresAuth: true,
    onEnter: () => ChatView.onEnter(),
  });

  Router.register('#/catalog', {
    viewId: 'catalog-view',
    requiresAuth: true,
    onEnter: () => CatalogView.onEnter(),
  });

  // Nav button listeners
  document.querySelectorAll('.nav-btn[data-route]').forEach(btn => {
    btn.addEventListener('click', () => Router.navigate(btn.dataset.route));
  });

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await AuthAPI.logout();
      } catch (e) {
        // Ignore errors
      }
      Router.navigate('#/auth');
    });
  }

  // Start router
  Router.init();
});
