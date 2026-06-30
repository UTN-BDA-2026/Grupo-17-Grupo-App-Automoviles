/* ═══════════════════════════════════════════════════════
   AUTH — Login & Register Logic
   ═══════════════════════════════════════════════════════ */

const AuthView = (() => {
  let currentTab = 'login';

  function init() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Form submission
    const form = document.getElementById('auth-form');
    form.addEventListener('submit', handleSubmit);

    // Password recovery link
    const recoveryLink = document.getElementById('auth-recovery-link');
    if (recoveryLink) {
      recoveryLink.addEventListener('click', (e) => {
        e.preventDefault();
        handlePasswordRecovery();
      });
    }
  }

  function switchTab(tab) {
    currentTab = tab;

    // Update tab styles
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Update button text
    const submitBtn = document.getElementById('auth-submit-btn');
    submitBtn.textContent = tab === 'login' ? 'Iniciar sesión' : 'Registrarse';

    // Show/hide recovery link
    const recoveryLink = document.getElementById('auth-recovery-wrapper');
    if (recoveryLink) {
      recoveryLink.style.display = tab === 'login' ? 'block' : 'none';
    }

    // Clear messages
    hideMessages();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('auth-submit-btn');

    if (!email || !password) {
      showError('Completá ambos campos.');
      return;
    }

    if (password.length < 8) {
      showError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>';
    hideMessages();

    try {
      if (currentTab === 'login') {
        await AuthAPI.login(email, password);
        Router.navigate('#/chat');
      } else {
        await AuthAPI.register(email, password);
        showSuccess('¡Registro exitoso! Si se requiere verificación, revisá tu correo. Luego iniciá sesión.');
        switchTab('login');
      }
    } catch (err) {
      showError(err.message || 'Ocurrió un error. Intentá nuevamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = currentTab === 'login' ? 'Iniciar sesión' : 'Registrarse';
    }
  }

  async function handlePasswordRecovery() {
    const email = document.getElementById('auth-email').value.trim();
    if (!email) {
      showError('Ingresá tu email para recuperar la contraseña.');
      return;
    }

    try {
      await AuthAPI.passwordRecovery(email);
      showSuccess('Se envió un correo de recuperación a tu email.');
    } catch (err) {
      showError(err.message || 'Error al enviar el correo de recuperación.');
    }
  }

  function showError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg;
    el.classList.add('visible');

    const success = document.getElementById('auth-success');
    success.classList.remove('visible');
  }

  function showSuccess(msg) {
    const el = document.getElementById('auth-success');
    el.textContent = msg;
    el.classList.add('visible');

    const error = document.getElementById('auth-error');
    error.classList.remove('visible');
  }

  function hideMessages() {
    document.getElementById('auth-error').classList.remove('visible');
    document.getElementById('auth-success').classList.remove('visible');
  }

  return { init };
})();

window.AuthView = AuthView;
