/**
 * quick-actions.js - Purposeful Command Palette (⌘K)
 * Fast, keyboard-first navigation for recruiters and visitors
 * Nadia Cañadas Giménez Portfolio
 */
(function() {
  const ACTIONS = [
    // 1. Live Software
    {
      group: 'Live Software',
      title: 'Launch Span Focus',
      sub: 'Deep work timer with category tracking (React & Supabase PWA)',
      icon: '⏱️',
      badge: 'Live PWA ↗',
      url: 'https://ncgimenez.github.io/span-focus/',
      external: true,
      keywords: 'span focus timer pomodoro pwa app react live'
    },
    {
      group: 'Live Software',
      title: 'Launch Span Plan',
      sub: 'Daily calendar buffer & automatic task rollover board',
      icon: '📅',
      badge: 'Live App ↗',
      url: 'https://ncgimenez.github.io/span-plan/',
      external: true,
      keywords: 'span plan calendar buffer rollover planning app'
    },

    // 2. Interactive Prototypes
    {
      group: 'Interactive Prototypes',
      title: 'SNCB Transit Connection Simulator',
      sub: 'Test the 2-stage rail simulator: vestibule doors & platform cross-section',
      icon: '🚆',
      badge: 'Interactive',
      url: '/projects/mobile-UX.html#sncb-simulator',
      keywords: 'sncb train transit platform doors stairs simulation'
    },
    {
      group: 'Interactive Prototypes',
      title: 'Google Calendar Selection Box',
      sub: 'Test the desktop marquee drag-to-select sandbox',
      icon: '🖱️',
      badge: 'Interactive',
      url: '/projects/google-calendar.html#calendar-sandbox',
      keywords: 'calendar google marquee select drag batch interaction'
    },
    {
      group: 'Interactive Prototypes',
      title: 'Hardware Teardown Sandbox',
      sub: 'Unscrew 4 pentalobe screws to pry open the smartphone battery compartment',
      icon: '🪛',
      badge: 'Interactive',
      url: '/blog/disassembly.html#teardown-sandbox',
      keywords: 'teardown disassembly hardware screw battery iphone repair'
    },
    {
      group: 'Interactive Prototypes',
      title: 'Audio Synthesizer & Signal Flow',
      sub: 'Play the Web Audio subtractive synth & explore signal routing in L\'Antichambre',
      icon: '🎹',
      badge: 'Web Audio',
      url: '/antechamber/#synth-keyboard',
      keywords: 'synth audio sound keyboard music filter antechamber'
    },

    // 3. Systems & Case Studies
    {
      group: 'Systems Case Studies',
      title: 'The Span Suite: Planning Without Overwhelm',
      sub: 'Dual-engine product design architecture & daily dogfooding log',
      icon: '📐',
      badge: 'Case Study',
      url: '/projects/span-suite.html',
      keywords: 'span case study product design architecture dogfooding'
    },
    {
      group: 'Systems Case Studies',
      title: 'SAP S/4HANA: O2C Without Chaos',
      sub: 'Eliminating rogue spreadsheets & standardising SAP condition contracts',
      icon: '🏢',
      badge: 'SAP ERP',
      url: '/projects/sap-o2c-standardization.html',
      keywords: 'sap s4hana erp sd pricing o2c order cash'
    },
    {
      group: 'Systems Case Studies',
      title: 'Odoo ERP: Three Disconnected Tools, One Coherent Flow',
      sub: 'Atomic inventory locking across sales, warehouse, and finance',
      icon: '📦',
      badge: 'Odoo ERP',
      url: '/projects/odoo-inventory.html',
      keywords: 'odoo erp inventory stock warehouse accounting'
    },

    // 4. Quick Actions
    {
      group: 'Quick Actions',
      title: 'Copy Email Address',
      sub: 'Copy ncgimenez@proton.me directly to your clipboard',
      icon: '📬',
      badge: 'Clipboard',
      action: 'copy-email',
      keywords: 'email contact message copy address'
    },
    {
      group: 'Quick Actions',
      title: 'Toggle Dark / Light Theme',
      sub: 'Switch between Studio Dark and Warm Linen color palettes',
      icon: '🌓',
      badge: 'Theme',
      action: 'toggle-theme',
      keywords: 'theme dark light mode color'
    },
    {
      group: 'Quick Actions',
      title: 'Visit GitHub Profile',
      sub: 'Explore open-source repositories and code (github.com/ncgimenez)',
      icon: '🐙',
      badge: 'GitHub ↗',
      url: 'https://github.com/ncgimenez',
      external: true,
      keywords: 'github code repo git profile'
    }
  ];

  // DOM Elements
  let backdrop, modal, input, listContainer, toast;
  let selectedIndex = 0;
  let filteredActions = ACTIONS;
  let isBuilt = false;

  function buildDOM() {
    if (isBuilt) return;
    isBuilt = true;

    // Toast
    toast = document.createElement('div');
    toast.className = 'cmd-palette-toast';
    toast.textContent = 'Email copied to clipboard! 📋';
    document.body.appendChild(toast);

    // Backdrop
    backdrop = document.createElement('div');
    backdrop.className = 'cmd-palette-backdrop';
    document.body.appendChild(backdrop);

    // Modal
    modal = document.createElement('div');
    modal.className = 'cmd-palette-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Quick Actions');

    modal.innerHTML = `
      <div class="cmd-palette-search">
        <svg class="cmd-palette-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="cmd-palette-input" placeholder="Type to search apps, prototypes, or case studies..." autocomplete="off" spellcheck="false" />
        <kbd class="cmd-palette-close-kbd">ESC</kbd>
      </div>
      <div class="cmd-palette-list" role="listbox"></div>
      <div class="cmd-palette-footer">
        <div class="cmd-palette-footer-keys">
          <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
        <span>Quick Actions</span>
      </div>
    `;

    document.body.appendChild(modal);

    input = modal.querySelector('.cmd-palette-input');
    listContainer = modal.querySelector('.cmd-palette-list');
    const escBtn = modal.querySelector('.cmd-palette-close-kbd');

    // Event listeners
    backdrop.addEventListener('click', closePalette);
    if (escBtn) escBtn.addEventListener('click', closePalette);

    input.addEventListener('input', function() {
      filterList(this.value);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(selectedIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(selectedIndex - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeAction(filteredActions[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  function openPalette() {
    buildDOM();
    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filterList('');
    requestAnimationFrame(() => {
      input.focus();
    });
  }

  function closePalette() {
    if (!modal) return;
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function filterList(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      filteredActions = ACTIONS;
    } else {
      filteredActions = ACTIONS.filter(item => {
        const str = `${item.title} ${item.sub} ${item.group} ${item.keywords || ''}`.toLowerCase();
        return str.includes(q);
      });
    }

    selectedIndex = 0;
    renderRows();
  }

  function renderRows() {
    if (filteredActions.length === 0) {
      listContainer.innerHTML = `
        <div class="cmd-palette-empty">
          <p>No matching action found</p>
          <span style="font-size: 0.8rem; color: var(--texte-muté);">Try searching for "Span", "SNCB", "SAP", or "Email"</span>
        </div>
      `;
      return;
    }

    // Group items
    const groups = {};
    filteredActions.forEach((item, idx) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push({ item, originalIdx: idx });
    });

    let html = '';
    for (const [groupName, items] of Object.entries(groups)) {
      html += `<div class="cmd-palette-section-title">${groupName}</div>`;
      items.forEach(({ item, originalIdx }) => {
        const isActive = (originalIdx === selectedIndex) ? 'is-active' : '';
        html += `
          <div class="cmd-palette-row ${isActive}" data-idx="${originalIdx}" role="option" aria-selected="${originalIdx === selectedIndex}">
            <div class="cmd-palette-row-left">
              <span class="cmd-palette-icon">${item.icon}</span>
              <div class="cmd-palette-text">
                <span class="cmd-palette-title">${escapeHtml(item.title)}</span>
                <span class="cmd-palette-sub">${escapeHtml(item.sub)}</span>
              </div>
            </div>
            <span class="cmd-palette-badge">${item.badge}</span>
          </div>
        `;
      });
    }

    listContainer.innerHTML = html;

    // Attach row click listeners
    const rows = listContainer.querySelectorAll('.cmd-palette-row');
    rows.forEach(row => {
      row.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'), 10);
        executeAction(filteredActions[idx]);
      });
      row.addEventListener('mouseenter', function() {
        const idx = parseInt(this.getAttribute('data-idx'), 10);
        setSelectedIndex(idx, false);
      });
    });
  }

  function setSelectedIndex(newIdx, scrollIntoView = true) {
    if (filteredActions.length === 0) return;
    if (newIdx < 0) newIdx = filteredActions.length - 1;
    if (newIdx >= filteredActions.length) newIdx = 0;

    selectedIndex = newIdx;

    const rows = listContainer.querySelectorAll('.cmd-palette-row');
    rows.forEach((row, i) => {
      const idx = parseInt(row.getAttribute('data-idx'), 10);
      const isMatch = (idx === selectedIndex);
      row.classList.toggle('is-active', isMatch);
      row.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      if (isMatch && scrollIntoView) {
        row.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function executeAction(item) {
    if (!item) return;
    closePalette();

    if (item.action === 'copy-email') {
      const email = 'ncgimenez@proton.me';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Email copied: ${email} 📋`);
        });
      } else {
        showToast(`Email: ${email}`);
      }
      return;
    }

    if (item.action === 'toggle-theme') {
      const themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) themeBtn.click();
      return;
    }

    if (item.url) {
      if (item.external) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.url;
      }
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Global Keyboard Trigger
  window.addEventListener('keydown', function(e) {
    // ⌘K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal && modal.classList.contains('is-open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  // Attach button trigger if present in DOM
  document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.getElementById('cmd-k-trigger');
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        openPalette();
      });
    }
  });

  // In case DOM is already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    const trigger = document.getElementById('cmd-k-trigger');
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        openPalette();
      });
    }
  }
})();
