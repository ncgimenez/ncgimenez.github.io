/**
 * quick-actions.js - Purposeful Command Palette (⌘K)
 * Fast, keyboard-first navigation for recruiters and visitors
 * Nadia Cañadas Giménez Portfolio & The Antechamber
 */
(function() {
  const isAntechamber = window.location.pathname.includes('/antechamber');

  // ============================================================
  // 1. ACTIONS POUR L'ANTICHAMBRE (Art, Photos, Audio, Manifestes)
  // ============================================================
  const ANTECHAMBER_ACTIONS = [
    // Visual Studies & Photography
    {
      group: 'Photographic Studies',
      title: 'Frame 01: Glass Reflections & Pale Sky',
      sub: 'Modern glass facade and cumulus clouds (Brussels)',
      icon: '🏛️',
      badge: 'Photo',
      action: 'select-plate-01',
      keywords: 'photo glass clouds modern facade architecture brutalist 01'
    },
    {
      group: 'Photographic Studies',
      title: 'Frame 02: Palm Silhouettes & Balcony Grids',
      sub: 'Sharp natural silhouette cutting residential balconies',
      icon: '🌴',
      badge: 'Photo',
      action: 'select-plate-02',
      keywords: 'photo palm tree balconies facade geometric 02'
    },
    {
      group: 'Photographic Studies',
      title: 'Frame 03: Concrete Slab & Glazed Reflections',
      sub: 'Vanishing transit platform slab and glass reflections',
      icon: '🚊',
      badge: 'Photo',
      action: 'select-plate-03',
      keywords: 'photo platform transit station concrete glass 03'
    },
    {
      group: 'Photographic Studies',
      title: 'Frame 04: The Wireframe Star & Sunset',
      sub: 'Geometric star sculpture against ochre dusk gradient',
      icon: '⭐',
      badge: 'Photo',
      action: 'select-plate-04',
      keywords: 'photo star skyline sunset dusk yellow building 04'
    },

    // Audio & Hardware Workbench
    {
      group: 'Sound & Atelier Bench',
      title: 'Play Live Web Audio Synthesizer',
      sub: 'Trigger real-time acoustic waves from pure CPU math (0 kB payload)',
      icon: '🎹',
      badge: 'Web Audio',
      url: '/antechamber/sound.html',
      keywords: 'synth keyboard sound audio music oscillator sound lab'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'Manifesto: I Take Things Apart',
      sub: 'Why opening screws and examining mechanics is the antidote to disposable UX',
      icon: '🪛',
      badge: 'Essay',
      url: '/blog/disassembly.html',
      keywords: 'teardown disassembly hardware tools repair manifesto'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'Reading Shelf & Workshop Notes',
      sub: 'Analog bus wiring, books, and software craft',
      icon: '📓',
      badge: 'Notes',
      url: '/antechamber/notes.html',
      keywords: 'notes workshop notebook audio bus wiring routing books reading'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'The Reserve: Broadsheet Gazette',
      sub: 'Dormant prototypes, archived hardware teardown logs & paused inventions',
      icon: '🗞️',
      badge: 'Gazette',
      url: '/antechamber/reserve.html',
      keywords: 'reserve gazette broadsheet archive prototype dormant on hold vault teardown chronos buffer'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'Behind the Curtain',
      sub: 'Making tedious tasks effortless & the craft of disassembly',
      icon: '🎭',
      badge: 'Manifesto',
      url: '/antechamber/about.html',
      keywords: 'behind curtain atelier workshop philosophy manifesto'
    },

    // Quick Studio Actions
    {
      group: 'Atelier Actions',
      title: 'Toggle Light / Dark Palette',
      sub: 'Switch between Ultraviolet Noir and Atelier Grège print',
      icon: '🌓',
      badge: 'Theme',
      action: 'toggle-theme',
      keywords: 'theme dark light mode color'
    },
    {
      group: 'Atelier Actions',
      title: 'Copy Email Address',
      sub: 'Copy ncgimenez@proton.me directly to clipboard',
      icon: '📬',
      badge: 'Clipboard',
      action: 'copy-email',
      keywords: 'email contact message copy address'
    },
    {
      group: 'Atelier Actions',
      title: 'Exit to Main Portfolio',
      sub: 'Return to professional engineering work, ERP systems & case studies',
      icon: '💼',
      badge: 'Pro Site ↗',
      url: '/',
      keywords: 'exit main portfolio pro return home work'
    }
  ];

  // ============================================================
  // 2. ACTIONS POUR LE SITE PRO (Logiciels, ERP, Études de cas)
  // ============================================================
  const PRO_ACTIONS = [
    // Live Software
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

    // Interactive Prototypes
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

    // Systems & Case Studies
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
      title: 'SNCB Mobile: Solving the 4-Minute Connection Anxiety',
      sub: 'Spatial awareness, carriage crowding, and bilingual wayfinding',
      icon: '🚆',
      badge: 'Case Study',
      url: '/projects/mobile-UX.html',
      keywords: 'sncb mobile ux case study transit train app'
    },
    {
      group: 'Systems Case Studies',
      title: 'Pedagogical System Design',
      sub: 'Multi-layer skill sequencing without cognitive overload',
      icon: '🧠',
      badge: 'Case Study',
      url: '/projects/pedagogical-system-design.html',
      keywords: 'pedagogical learning curriculum design system case study'
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

    // Quick Actions
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
      title: 'About Nadia',
      sub: 'Background, transition from ERP architecture to product design',
      icon: '👩‍💻',
      badge: 'About',
      url: '/about.html',
      keywords: 'about nadia bio background profile cv'
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

  // Active actions set depending on the environment
  const ACTIONS = isAntechamber ? ANTECHAMBER_ACTIONS : PRO_ACTIONS;

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
    modal.setAttribute('aria-label', isAntechamber ? 'Antechamber Actions' : 'Quick Actions');

    const placeholderText = isAntechamber
      ? 'Search photographic frames, audio bench, essays, or notes...'
      : 'Type to search live apps, prototypes, or case studies...';

    modal.innerHTML = `
      <div class="cmd-palette-search">
        <svg class="cmd-palette-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="cmd-palette-input" placeholder="${placeholderText}" autocomplete="off" spellcheck="false" />
        <kbd class="cmd-palette-close-kbd">ESC</kbd>
      </div>
      <div class="cmd-palette-list" role="listbox"></div>
      <div class="cmd-palette-footer">
        <div class="cmd-palette-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</div>
        <div class="cmd-palette-hint"><kbd>↵</kbd> Select</div>
        <div class="cmd-palette-hint"><kbd>ESC</kbd> Close</div>
      </div>
    `;
    document.body.appendChild(modal);

    input = modal.querySelector('.cmd-palette-input');
    listContainer = modal.querySelector('.cmd-palette-list');

    // Events
    backdrop.addEventListener('click', closePalette);
    modal.querySelector('.cmd-palette-close-kbd').addEventListener('click', closePalette);

    input.addEventListener('input', function() {
      filterActions(input.value.trim());
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        changeSelection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        changeSelection(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions.length > 0) {
          executeAction(filteredActions[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    });

    listContainer.addEventListener('click', function(e) {
      const itemRow = e.target.closest('.cmd-palette-item');
      if (!itemRow) return;
      const idx = parseInt(itemRow.dataset.index, 10);
      if (!isNaN(idx) && filteredActions[idx]) {
        executeAction(filteredActions[idx]);
      }
    });
  }

  function openPalette() {
    buildDOM();
    filteredActions = ACTIONS;
    selectedIndex = 0;
    input.value = '';
    renderList();
    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    setTimeout(() => input.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    if (!modal) return;
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function filterActions(query) {
    if (!query) {
      filteredActions = ACTIONS;
    } else {
      const q = query.toLowerCase();
      filteredActions = ACTIONS.filter(item => {
        return item.title.toLowerCase().includes(q) ||
               item.sub.toLowerCase().includes(q) ||
               item.group.toLowerCase().includes(q) ||
               (item.keywords && item.keywords.includes(q));
      });
    }
    selectedIndex = 0;
    renderList();
  }

  function renderList() {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (filteredActions.length === 0) {
      listContainer.innerHTML = `
        <div class="cmd-palette-empty">
          <p>No matching actions found.</p>
        </div>
      `;
      return;
    }

    // Group by group name
    let lastGroup = null;
    filteredActions.forEach((item, index) => {
      if (item.group !== lastGroup) {
        lastGroup = item.group;
        const groupHeader = document.createElement('div');
        groupHeader.className = 'cmd-palette-group-title';
        groupHeader.textContent = item.group;
        listContainer.appendChild(groupHeader);
      }

      const itemRow = document.createElement('div');
      itemRow.className = `cmd-palette-item ${index === selectedIndex ? 'is-active' : ''}`;
      itemRow.dataset.index = index;
      itemRow.setAttribute('role', 'option');
      itemRow.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');

      itemRow.innerHTML = `
        <span class="cmd-palette-item-icon">${item.icon}</span>
        <div class="cmd-palette-item-content">
          <div class="cmd-palette-item-title">${escapeHtml(item.title)}</div>
          <div class="cmd-palette-item-sub">${escapeHtml(item.sub)}</div>
        </div>
        ${item.badge ? `<span class="cmd-palette-item-badge">${escapeHtml(item.badge)}</span>` : ''}
      `;

      listContainer.appendChild(itemRow);
    });
  }

  function changeSelection(delta) {
    if (filteredActions.length === 0) return;
    selectedIndex = (selectedIndex + delta + filteredActions.length) % filteredActions.length;
    updateActiveRow(true);
  }

  function updateActiveRow(scrollIntoView) {
    const rows = listContainer.querySelectorAll('.cmd-palette-item');
    rows.forEach((row, idx) => {
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

    // 1. Photography plate switcher (Antechamber)
    if (item.action && item.action.startsWith('select-plate-')) {
      const plateNum = item.action.replace('select-plate-', '');
      if (window.location.pathname.includes('lens')) {
        const thumb = document.querySelector(`.filmstrip-thumb[data-plate="${plateNum}"]`);
        if (thumb) thumb.click();
        const stage = document.getElementById('exhibition-stage');
        if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.location.href = `/antechamber/lens.html`;
      }
      return;
    }

    // 2. Copy Email
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

    // 3. Toggle Theme
    if (item.action === 'toggle-theme') {
      const themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) themeBtn.click();
      return;
    }

    // 4. URL Navigation
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

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
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
})();
