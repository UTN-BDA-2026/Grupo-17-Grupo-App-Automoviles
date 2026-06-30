/* ═══════════════════════════════════════════════════════
   API Module — Centralized API calls
   ═══════════════════════════════════════════════════════ */

const API_BASE = '/api';

/**
 * Token management in localStorage.
 */
const TokenStore = {
  getAccess: ()  => localStorage.getItem('access_token'),
  getRefresh: () => localStorage.getItem('refresh_token'),
  set(access, refresh) {
    if (access)  localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
  },
  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  isLoggedIn() {
    return !!this.getAccess();
  },
};

/**
 * Base fetch wrapper with auth headers and error handling.
 */
async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = TokenStore.getAccess();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Try to parse JSON, fallback to text
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = (data && data.message) || data || `Error ${response.status}`;
    const error = new Error(Array.isArray(message) ? message.join(', ') : message);
    error.status = response.status;
    throw error;
  }

  return data;
}

/* ── Auth API ── */

const AuthAPI = {
  async register(email, password) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Extract tokens from the Supabase session response
    const session = data.session || data;
    if (session.access_token) {
      TokenStore.set(session.access_token, session.refresh_token);
    }
    return data;
  },

  async logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      TokenStore.clear();
    }
  },

  async refresh() {
    const refreshToken = TokenStore.getRefresh();
    if (!refreshToken) throw new Error('No refresh token');

    const data = await apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    const session = data.session || data;
    if (session.access_token) {
      TokenStore.set(session.access_token, session.refresh_token);
    }
    return data;
  },

  async passwordRecovery(email) {
    return apiFetch('/auth/password-recovery', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

/* ── Chat API ── */

const ChatAPI = {
  async createSession(title) {
    return apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  async listSessions() {
    return apiFetch('/chat');
  },

  async getSession(id) {
    return apiFetch(`/chat/${id}`);
  },

  async sendMessage(sessionId, content) {
    return apiFetch(`/chat/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

/* ── Products API ── */

const ProductsAPI = {
  async list(pageNumber = 1, pageSize = 20) {
    return apiFetch(`/products?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  async getById(id) {
    return apiFetch(`/products/${id}`);
  },
};

// Export for use in other modules
window.TokenStore = TokenStore;
window.AuthAPI = AuthAPI;
window.ChatAPI = ChatAPI;
window.ProductsAPI = ProductsAPI;
