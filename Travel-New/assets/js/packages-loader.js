/**
 * packages-loader.js
 * Shared module: loads package data once and provides helpers
 * to render sanctuary cards and image-rich category tiles on any page.
 * Supports file:// protocol via window.SAVERON_PACKAGES_DATA (packages-data.js).
 */

(function () {
  'use strict';

  const DATA_URL = 'assets/data/packages.json';

  const STORAGE_KEY = 'saveron_packages_data';

  /* ── Cache ── */
  let _data = null;

  async function loadData() {
    if (_data) return _data;
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        _data = JSON.parse(local);
        return _data;
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    if (typeof window !== 'undefined' && window.SAVERON_PACKAGES_DATA) {
      _data = JSON.parse(JSON.stringify(window.SAVERON_PACKAGES_DATA));
      return _data;
    }
    try {
      const res = await fetch(DATA_URL);
      _data = await res.json();
      return _data;
    } catch (err) {
      if (typeof window !== 'undefined' && window.SAVERON_PACKAGES_DATA) {
        _data = JSON.parse(JSON.stringify(window.SAVERON_PACKAGES_DATA));
        return _data;
      }
      console.error('Failed to load packages data:', err);
      throw err;
    }
  }

  function saveData(newData) {
    _data = newData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Could not save to localStorage', e);
      if (typeof alert === 'function') {
        alert('Warning: Browser storage limit reached. Please use smaller/compressed images.');
      }
    }
    return _data;
  }

  function resetData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    _data = null;
    return loadData();
  }

  /* ── Helpers ── */
  function formatPrice(price) {
    return price ? price.label : '100% Customisable';
  }

  function routeHTML(route) {
    return route.join(' &bull; ');
  }

  /**
   * Build a sanctuary-card article element from a package object.
   */
  function buildCard(pkg, showRoute = true, showPrice = true) {
    const article = document.createElement('article');
    article.className = 'sanctuary-card pkg-item';
    article.setAttribute('data-dest', pkg.dest);
    article.setAttribute('data-type', pkg.category);
    article.setAttribute('data-duration', pkg.durationCode || 'medium');

    const inquireLink = `contact.html?pkg=${encodeURIComponent(pkg.name)}&cat=${encodeURIComponent(pkg.category)}`;

    article.innerHTML = `
      <div class="sanctuary-image-wrap">
        <img src="${pkg.image}" alt="${pkg.imageAlt}" loading="lazy">
        <span class="sanctuary-tag">${pkg.duration.toUpperCase()}</span>
        ${showPrice && pkg.price ? `<span class="pkg-price-badge">${pkg.price.currency}${(pkg.price.amount).toLocaleString('en-IN')}+</span>` : ''}
      </div>
      <div class="sanctuary-body">
        <div class="pkg-category-chip">${pkg.tag}</div>
        <h3>${pkg.name}</h3>
        <p>${pkg.description}</p>
        ${showRoute && pkg.route ? `
        <div class="pkg-route-bar">
          <strong>Route:</strong> ${routeHTML(pkg.route)}
        </div>` : ''}
        ${showPrice && pkg.price ? `
        <div class="pkg-price-row">
          <span class="pkg-price-label">${formatPrice(pkg.price)}</span>
        </div>` : ''}
        <div class="sanctuary-meta">
          <span style="color: var(--emerald-primary);">100% Customisable</span>
          <a href="${inquireLink}" class="action-link">Inquire Route &rarr;</a>
        </div>
        <div class="pkg-highlights-preview">
          ${pkg.highlights.slice(0, 3).map(h => `<span class="pkg-highlight-chip">✓ ${h}</span>`).join('')}
        </div>
        <div class="pkg-incl-excl" style="display:none;">
          <div class="pkg-inclusions">
            <strong>Inclusions:</strong>
            <ul>${pkg.inclusions.map(i => `<li>${i}</li>`).join('')}</ul>
          </div>
          <div class="pkg-exclusions">
            <strong>Exclusions:</strong>
            <ul>${pkg.exclusions.map(e => `<li>${e}</li>`).join('')}</ul>
          </div>
        </div>
        <button class="pkg-details-toggle action-link" style="margin-top:8px; background:none; border:none; cursor:pointer; font-size:0.85rem; padding:0; color:var(--emerald-primary);">
          View Details ▾
        </button>
      </div>`;

    /* Toggle inclusions/exclusions */
    const btn   = article.querySelector('.pkg-details-toggle');
    const panel = article.querySelector('.pkg-incl-excl');
    btn.addEventListener('click', () => {
      const open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      btn.textContent = open ? 'View Details ▾' : 'Hide Details ▴';
    });

    return article;
  }

  /**
   * Build an image-rich category tile. Uses the first package image of the category as background.
   * @param {Object} cat        - Category object {id, label, icon, description}
   * @param {Array}  packages   - All packages (to pick cover image and count)
   * @param {Function} onExplore - Callback(catId, catLabel)
   */
  function buildCategoryTile(cat, packages, onExplore) {
    const catPkgs  = packages.filter(p => p.category === cat.id);
    const count    = catPkgs.length;
    const coverImg = cat.coverImage || (catPkgs.length ? catPkgs[0].image : '');
    const minPrice = catPkgs.length
      ? Math.min(...catPkgs.map(p => p.price ? p.price.amount : Infinity))
      : null;

    const isImgIcon = cat.icon && (cat.icon.startsWith('data:') || cat.icon.startsWith('http') || cat.icon.startsWith('assets/'));
    const iconHTML = isImgIcon
      ? `<img src="${cat.icon}" alt="" style="width:18px; height:18px; object-fit:contain; vertical-align:middle; border-radius:3px; margin-right:4px;">`
      : `${cat.icon || '🌿'} `;

    const tile = document.createElement('div');
    tile.className = 'pkg-cat-img-tile';
    tile.setAttribute('data-cat', cat.id);

    tile.innerHTML = `
      <div class="pkg-cat-img-wrap">
        ${coverImg ? `<img src="${coverImg}" alt="${cat.label}" loading="lazy">` : '<div class="pkg-cat-img-placeholder"></div>'}
        <div class="pkg-cat-img-overlay"></div>
        <div class="pkg-cat-img-top-badge">${iconHTML}${cat.label}</div>
        <div class="pkg-cat-img-bottom">
          <div class="pkg-cat-img-meta">
            <span class="pkg-cat-img-count">${count} Package${count !== 1 ? 's' : ''}</span>
            ${minPrice ? `<span class="pkg-cat-img-price">From ₹${minPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <p class="pkg-cat-img-desc">${cat.description}</p>
          <button class="pkg-cat-img-explore-btn" data-cat="${cat.id}">
            Explore <span class="pkg-cat-explore-arrow">→</span>
          </button>
        </div>
      </div>`;

    tile.querySelector('.pkg-cat-img-explore-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof onExplore === 'function') onExplore(cat.id, cat.label);
    });

    /* Also clicking the whole tile explores */
    tile.addEventListener('click', () => {
      if (typeof onExplore === 'function') onExplore(cat.id, cat.label);
    });

    return tile;
  }

  /**
   * Render image-rich category tiles into a container.
   */
  async function renderCategories(containerId, onExplore) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const { categories, packages } = await loadData();
    container.innerHTML = '';
    categories.forEach(cat => {
      container.appendChild(buildCategoryTile(cat, packages, onExplore));
    });
  }

  /**
   * Render ALL packages into a container with full filter support.
   */
  async function renderPackages(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const { packages } = await loadData();
    container.innerHTML = '';
    packages.forEach(pkg => container.appendChild(buildCard(pkg, true, true)));
  }

  /**
   * Render featured cards into a container (index.html style — no route bar).
   */
  async function renderFeatured(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const { packages } = await loadData();
    container.innerHTML = '';
    packages.filter(p => p.featured).forEach(pkg => {
      const card = buildCard(pkg, false, true);
      const metaLink = card.querySelector('.action-link');
      if (metaLink) {
        metaLink.href = `packages.html?dest=${pkg.dest}`;
        metaLink.textContent = 'View Itinerary →';
      }
      container.appendChild(card);
    });
  }

  /**
   * Render packages for a specific category into a container.
   */
  async function renderCategoryPackages(containerId, catId, filterDest) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const { packages } = await loadData();
    container.innerHTML = '';
    const filtered = packages.filter(p =>
      p.category === catId && (!filterDest || p.dest === filterDest));
    if (filtered.length === 0) {
      container.innerHTML = '<div class="pkg-loading">No packages found in this category.</div>';
    } else {
      filtered.forEach(p => container.appendChild(buildCard(p, true, true)));
    }
  }

  /**
   * Filter already-rendered .pkg-item cards by dest / type / duration / search.
   */
  function applyFilters(containerId, { query = '', dest = 'all', type = 'all', duration = 'any' } = {}) {
    const items = document.querySelectorAll(`#${containerId} .pkg-item`);
    items.forEach(item => {
      const text     = item.innerText.toLowerCase();
      const itemDest = item.getAttribute('data-dest');
      const itemType = item.getAttribute('data-type');
      const itemDur  = item.getAttribute('data-duration');

      const ok =
        (!query    || text.includes(query.toLowerCase())) &&
        (dest === 'all'     || itemDest === dest) &&
        (type === 'all'     || itemType === type) &&
        (duration === 'any' || itemDur  === duration);

      item.style.display = ok ? '' : 'none';
    });
  }

  /* ── Public API ── */
  window.SaveronPackages = {
    loadData,
    saveData,
    resetData,
    buildCard,
    buildCategoryTile,
    renderCategories,
    renderCategoryPackages,
    renderPackages,
    renderFeatured,
    applyFilters,
  };
})();
