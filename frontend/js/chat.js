/* ═══════════════════════════════════════════════════════
   CHAT — Conversation & Messaging Logic
   ═══════════════════════════════════════════════════════ */

const ChatView = (() => {
  let sessions = [];
  let activeSessionId = null;
  let isSending = false;

  function init() {
    // New conversation button
    document.getElementById('chat-new-btn').addEventListener('click', createNewSession);

    // Send message
    document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    document.getElementById('chat-input').addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('chat-sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleSidebar);
    }

    // Suggestion chips
    document.querySelectorAll('.chat-welcome__suggestion').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        input.value = chip.textContent;
        input.focus();
      });
    });
  }

  async function onEnter() {
    await loadSessions();
  }

  async function loadSessions() {
    try {
      sessions = await ChatAPI.listSessions();
      renderSidebar();
    } catch (err) {
      console.error('Error loading sessions:', err);
      if (err.status === 401) {
        TokenStore.clear();
        Router.navigate('#/auth');
      }
    }
  }

  function renderSidebar() {
    const list = document.getElementById('chat-session-list');
    if (!sessions || sessions.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
          <p style="font-size: var(--font-size-sm);">No tenés conversaciones aún. ¡Creá una nueva!</p>
        </div>
      `;
      return;
    }

    list.innerHTML = sessions.map(s => `
      <div class="chat-sidebar__item ${s.id === activeSessionId ? 'active' : ''}"
           data-session-id="${s.id}" onclick="ChatView.selectSession('${s.id}')">
        <div class="chat-sidebar__item-title">${escapeHtml(s.title)}</div>
        <div class="chat-sidebar__item-date">${formatDate(s.updated_at || s.created_at)}</div>
      </div>
    `).join('');
  }

  async function createNewSession() {
    const title = prompt('Título de la conversación:', 'Nueva búsqueda');
    if (!title) return;

    try {
      const session = await ChatAPI.createSession(title.trim());
      sessions.unshift(session);
      activeSessionId = session.id;
      renderSidebar();
      showMessages([]);
      closeSidebarMobile();
    } catch (err) {
      showToast('Error al crear la conversación.', 'error');
    }
  }

  async function selectSession(sessionId) {
    activeSessionId = sessionId;
    renderSidebar();
    closeSidebarMobile();

    try {
      const session = await ChatAPI.getSession(sessionId);
      const messages = session.message || session.messages || [];
      showMessages(messages);
    } catch (err) {
      showToast('Error al cargar la conversación.', 'error');
    }
  }

  function showMessages(messages) {
    const container = document.getElementById('chat-messages');
    const welcome = document.getElementById('chat-welcome');
    const inputArea = document.getElementById('chat-input-area');

    if (!activeSessionId) {
      welcome.style.display = 'flex';
      container.innerHTML = '';
      inputArea.style.display = 'none';
      return;
    }

    welcome.style.display = 'none';
    inputArea.style.display = 'block';

    if (!messages || messages.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Enviá tu primer mensaje para empezar la conversación con el agente.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(m => renderMessage(m)).join('');
    scrollToBottom();
  }

  function renderMessage(msg, metadata = null) {
    const isUser = msg.role === 'user';
    const avatarText = isUser ? 'Tú' : 'AI';
    const contentHtml = formatMessageContent(msg.content);

    let metadataHtml = '';
    if (metadata && !isUser) {
      const badges = [];
      if (metadata.intent) {
        badges.push(`<span class="badge badge--accent">${escapeHtml(metadata.intent)}</span>`);
      }
      if (metadata.candidatesFound > 0) {
        badges.push(`<span class="badge badge--success">${metadata.candidatesFound} candidatos</span>`);
      }
      if (metadata.needsClarification) {
        badges.push(`<span class="badge badge--warning">Necesita más datos</span>`);
      }
      if (badges.length > 0) {
        metadataHtml = `<div class="message__metadata">${badges.join('')}</div>`;
      }
    }

    return `
      <div class="message message--${isUser ? 'user' : 'assistant'}">
        <div class="message__avatar">${avatarText}</div>
        <div class="message__content">
          ${contentHtml}
          ${metadataHtml}
        </div>
      </div>
    `;
  }

  async function sendMessage() {
    if (isSending) return;

    const input = document.getElementById('chat-input');
    const content = input.value.trim();
    if (!content || !activeSessionId) return;

    isSending = true;
    input.value = '';
    input.style.height = 'auto';

    const sendBtn = document.getElementById('chat-send-btn');
    sendBtn.disabled = true;

    // Add user message to UI immediately
    const container = document.getElementById('chat-messages');
    // Remove empty state if present
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    container.insertAdjacentHTML('beforeend', renderMessage({ role: 'user', content }));
    scrollToBottom();

    // Show typing indicator
    showTyping(true);

    try {
      const result = await ChatAPI.sendMessage(activeSessionId, content);

      showTyping(false);

      // Add assistant message with metadata
      container.insertAdjacentHTML('beforeend',
        renderMessage(
          { role: 'assistant', content: result.assistantMessage.content },
          result.metadata
        )
      );
      scrollToBottom();
    } catch (err) {
      showTyping(false);
      container.insertAdjacentHTML('beforeend',
        renderMessage({
          role: 'assistant',
          content: 'Hubo un error al procesar tu mensaje. Por favor, intentá nuevamente.'
        })
      );
      scrollToBottom();

      if (err.status === 401) {
        TokenStore.clear();
        Router.navigate('#/auth');
      }
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function showTyping(show) {
    const indicator = document.getElementById('typing-indicator');
    indicator.classList.toggle('visible', show);
    if (show) scrollToBottom();
  }

  function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('chat-sidebar');
    sidebar.classList.toggle('open');
  }

  function closeSidebarMobile() {
    const sidebar = document.getElementById('chat-sidebar');
    sidebar.classList.remove('open');
  }

  // ── Helpers ──

  function formatMessageContent(text) {
    if (!text) return '';
    // Basic markdown-like formatting
    let html = escapeHtml(text);

    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Unordered lists: lines starting with - or •
    html = html.replace(/^[\-•]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Numbered lists: lines starting with digit.
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Paragraphs (double newlines)
    html = html.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('');

    // Single newlines within paragraphs
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  }

  return { init, onEnter, selectSession };
})();

window.ChatView = ChatView;
