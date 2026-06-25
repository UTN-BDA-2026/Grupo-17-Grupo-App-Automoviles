/* ═══════════════════════════════════════════════════════
   CATALOG — Vehicle Grid & Detail Logic
   ═══════════════════════════════════════════════════════ */

const CatalogView = (() => {
  let currentPage = 1;
  let pageSize = 12;
  let totalItems = 0;
  let isLoading = false;

  function init() {
    // Modal close
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('vehicle-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) closeModal();
    });

    // Close modal with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  async function onEnter() {
    if (!document.querySelector('.vehicle-card')) {
      await loadProducts();
    }
  }

  async function loadProducts() {
    if (isLoading) return;
    isLoading = true;

    showSkeleton();

    try {
      const result = await ProductsAPI.list(currentPage, pageSize);
      totalItems = result.total;
      renderGrid(result.data);
      renderPagination();
      updateCount();
    } catch (err) {
      console.error('Error loading products:', err);
      if (err.status === 401) {
        TokenStore.clear();
        Router.navigate('#/auth');
        return;
      }
      document.getElementById('catalog-grid').innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Error al cargar los vehículos. Verificá que el backend esté corriendo.</p>
        </div>
      `;
    } finally {
      isLoading = false;
    }
  }

  function renderGrid(listings) {
    const grid = document.getElementById('catalog-grid');

    if (!listings || listings.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>No se encontraron vehículos.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = listings.map((listing, i) => {
      const brand = listing.vehicle?.model?.brand?.name || 'Sin marca';
      const model = listing.vehicle?.model?.name || 'Sin modelo';
      const year = listing.vehicle?.year || '-';
      const version = listing.vehicle?.version || '';
      const price = formatPrice(listing.price);
      const currency = listing.currency || 'ARS';

      return `
        <div class="vehicle-card" onclick="CatalogView.openDetail('${listing.id}')"
             style="animation-delay: ${i * 60}ms">
          <div class="vehicle-card__header">
            <div>
              <div class="vehicle-card__brand">${escapeHtml(brand)}</div>
              <div class="vehicle-card__name">${escapeHtml(model)}</div>
              <div class="vehicle-card__year">${year} ${version ? '· ' + escapeHtml(version) : ''}</div>
            </div>
          </div>

          <div class="vehicle-card__price">
            ${price}<span class="vehicle-card__price-currency">${currency}</span>
          </div>

          <div class="vehicle-card__specs">
            <div class="vehicle-card__spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${escapeHtml(listing.fuel_type || '-')}
            </div>
            <div class="vehicle-card__spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${formatNumber(listing.mileage)} km
            </div>
            <div class="vehicle-card__spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${escapeHtml(listing.transmission || '-')}
            </div>
            <div class="vehicle-card__spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${listing.doors || '-'} puertas
            </div>
          </div>

          <div class="vehicle-card__tags">
            ${getFuelBadge(listing.fuel_type)}
            ${listing.condition ? `<span class="badge badge--info">${escapeHtml(listing.condition)}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPagination() {
    const container = document.getElementById('catalog-pagination');
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = `
      <button class="pagination__btn" ${currentPage === 1 ? 'disabled' : ''}
              onclick="CatalogView.goToPage(${currentPage - 1})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;

    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      html += `<button class="pagination__btn" onclick="CatalogView.goToPage(1)">1</button>`;
      if (start > 2) html += `<span class="pagination__info">…</span>`;
    }

    for (let i = start; i <= end; i++) {
      html += `<button class="pagination__btn ${i === currentPage ? 'active' : ''}"
                       onclick="CatalogView.goToPage(${i})">${i}</button>`;
    }

    if (end < totalPages) {
      if (end < totalPages - 1) html += `<span class="pagination__info">…</span>`;
      html += `<button class="pagination__btn" onclick="CatalogView.goToPage(${totalPages})">${totalPages}</button>`;
    }

    html += `
      <button class="pagination__btn" ${currentPage === totalPages ? 'disabled' : ''}
              onclick="CatalogView.goToPage(${currentPage + 1})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;

    container.innerHTML = html;
  }

  function updateCount() {
    const countEl = document.getElementById('catalog-count');
    if (countEl) {
      countEl.textContent = `${totalItems} vehículos`;
    }
  }

  async function goToPage(page) {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
    await loadProducts();
    // Scroll to top of catalog
    document.getElementById('catalog-view').scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function openDetail(listingId) {
    const modal = document.getElementById('vehicle-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = '<div style="display:flex;justify-content:center;padding:var(--space-8);"><span class="spinner spinner--lg"></span></div>';
    modal.classList.remove('hidden');

    try {
      const listing = await ProductsAPI.getById(listingId);
      renderDetail(listing);
    } catch (err) {
      body.innerHTML = '<p style="color:var(--color-error);text-align:center;padding:var(--space-8);">Error al cargar el detalle.</p>';
    }
  }

  function renderDetail(listing) {
    const body = document.getElementById('modal-body');
    const brand = listing.vehicle?.model?.brand?.name || 'Sin marca';
    const model = listing.vehicle?.model?.name || 'Sin modelo';
    const year = listing.vehicle?.year || '-';
    const version = listing.vehicle?.version || '';
    const linkUrl = listing.link?.url || null;

    const title = document.getElementById('modal-title');
    title.textContent = `${brand} ${model} ${year}`;

    body.innerHTML = `
      <div class="detail-price-block">
        <span class="detail-price-block__price">${formatPrice(listing.price)}</span>
        <span class="detail-price-block__currency">${listing.currency || 'ARS'}</span>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-item__label">Marca</span>
          <span class="detail-item__value">${escapeHtml(brand)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Modelo</span>
          <span class="detail-item__value">${escapeHtml(model)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Año</span>
          <span class="detail-item__value">${year}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Versión</span>
          <span class="detail-item__value">${escapeHtml(version || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Kilometraje</span>
          <span class="detail-item__value">${formatNumber(listing.mileage)} km</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Color</span>
          <span class="detail-item__value">${escapeHtml(listing.color || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Combustible</span>
          <span class="detail-item__value">${escapeHtml(listing.fuel_type || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Transmisión</span>
          <span class="detail-item__value">${escapeHtml(listing.transmission || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Puertas</span>
          <span class="detail-item__value">${listing.doors || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Capacidad</span>
          <span class="detail-item__value">${listing.people_capacity ? listing.people_capacity + ' personas' : '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Condición</span>
          <span class="detail-item__value">${escapeHtml(listing.condition || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Dirección</span>
          <span class="detail-item__value">${escapeHtml(listing.direction || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Tracción</span>
          <span class="detail-item__value">${escapeHtml(listing.traction_control || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Motor</span>
          <span class="detail-item__value">${escapeHtml(listing.engine || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Tipo de carrocería</span>
          <span class="detail-item__value">${escapeHtml(listing.body_type || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item__label">Único dueño</span>
          <span class="detail-item__value">${listing.sole_owner === true ? 'Sí' : listing.sole_owner === false ? 'No' : '-'}</span>
        </div>
      </div>

      ${linkUrl ? `
        <a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener noreferrer" class="detail-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Ver publicación original
        </a>
      ` : ''}
    `;
  }

  function closeModal() {
    document.getElementById('vehicle-modal').classList.add('hidden');
  }

  function showSkeleton() {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = Array.from({ length: pageSize }, () => `
      <div class="skeleton-card">
        <div class="skeleton-line skeleton-line--short"></div>
        <div class="skeleton-line skeleton-line--medium"></div>
        <div class="skeleton-line skeleton-line--short" style="margin-top: var(--space-2);"></div>
        <div class="skeleton-line skeleton-line--xl"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);margin-top:var(--space-4);">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    `).join('');
  }

  // ── Helpers ──

  function getFuelBadge(fuelType) {
    if (!fuelType) return '';
    const lower = fuelType.toLowerCase();
    if (lower.includes('nafta') || lower.includes('gasolina') || lower.includes('naftero'))
      return `<span class="badge badge--success">${escapeHtml(fuelType)}</span>`;
    if (lower.includes('diesel') || lower.includes('diésel'))
      return `<span class="badge badge--warning">${escapeHtml(fuelType)}</span>`;
    if (lower.includes('eléctrico') || lower.includes('electrico') || lower.includes('híbrido') || lower.includes('hibrido'))
      return `<span class="badge badge--info">${escapeHtml(fuelType)}</span>`;
    if (lower.includes('gnc') || lower.includes('gas'))
      return `<span class="badge badge--accent">${escapeHtml(fuelType)}</span>`;
    return `<span class="badge badge--accent">${escapeHtml(fuelType)}</span>`;
  }

  return { init, onEnter, goToPage, openDetail };
})();

window.CatalogView = CatalogView;
