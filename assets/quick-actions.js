/**
 * quick-actions.js - Purposeful Command Palette (⌘K)
 * Fast, keyboard-first navigation for recruiters and visitors
 * Nadia Cañadas Giménez Portfolio & The Antechamber
 */
(function() {
  const isAntechamber = window.location.pathname.includes('/antechamber');

  // Minimalist vector SVG icons (zero emojis)
  const ICONS = {
    timer: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    calendar: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    train: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="15" rx="3"/><line x1="4" y1="11" x2="20" y2="11"/><path d="M12 3v8"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="m8 18-3 3"/><path d="m16 18 3 3"/></svg>',
    marquee: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 3"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>',
    tool: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    layers: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    server: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    package: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    network: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M7.5 16.5 10 7.5"/><path d="m14 7.5 2.5 9"/></svg>',
    mail: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    theme: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    github: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    key: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3"/><path d="m18.5 4.5 2 2"/></svg>',
    camera: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    audio: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v4"/><path d="M6 6v12"/><path d="M10 3v18"/><path d="M14 8v8"/><path d="M18 5v14"/><path d="M22 10v4"/></svg>',
    book: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>',
    gazette: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
    manifesto: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  };

  // ============================================================
  // 1. ACTIONS POUR L'ANTICHAMBRE (Art, Photos, Audio, Manifestes)
  // ============================================================
  const ANTECHAMBER_ACTIONS = [
    // Visual Studies & Photography
    {
      group: 'Photographic Studies',
      title: 'Frame 01: Glass Reflections & Pale Sky',
      sub: 'Modern glass facade and cumulus clouds (Brussels)',
      icon: 'camera',
      badge: 'Photo',
      action: 'select-plate-01',
      keywords: 'photo glass clouds modern facade architecture brutalist 01'
    },
    {
      group: 'Photographic Studies',
      title: 'Frame 02: Palm Silhouettes & Balcony Grids',
      sub: 'Sharp natural silhouette cutting residential balconies',
      icon: 'camera',
      badge: 'Photo',
      action: 'select-plate-02',
      keywords: 'photo palm tree balconies facade geometric 02'
    },
    {
      group: 'Photographic Studies',
      title: 'Frame 03: Concrete Slab & Glazed Reflections',
      sub: 'Vanishing transit platform slab and glass reflections',
      icon: 'camera',
      badge: 'Photo',
      action: 'select-plate-03',
      keywords: 'photo platform transit station concrete glass 03'
    },
    {
      group: 'Photographic Studies',
      title: 'Frame 04: The Wireframe Star & Sunset',
      sub: 'Geometric star sculpture against ochre dusk gradient',
      icon: 'camera',
      badge: 'Photo',
      action: 'select-plate-04',
      keywords: 'photo star skyline sunset dusk yellow building 04'
    },

    // Audio & Hardware Workbench
    {
      group: 'Sound & Atelier Bench',
      title: 'Play Live Web Audio Synthesizer',
      sub: 'Trigger real-time acoustic waves from pure CPU math (0 kB payload)',
      icon: 'audio',
      badge: 'Web Audio',
      url: '/antechamber/sound.html',
      keywords: 'synth keyboard sound audio music oscillator sound lab'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'Manifesto: I Take Things Apart',
      sub: 'Why opening screws and examining mechanics is the antidote to disposable software',
      icon: 'tool',
      badge: 'Essay',
      url: '/blog/disassembly.html',
      keywords: 'teardown disassembly hardware tools repair manifesto'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'Reading Shelf & Workshop Notes',
      sub: 'Analog bus wiring, books, and software craft',
      icon: 'book',
      badge: 'Notes',
      url: '/antechamber/notes.html',
      keywords: 'notes workshop notebook audio bus wiring routing books reading'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'The Reserve: Broadsheet Gazette',
      sub: 'Dormant prototypes, hardware teardown logs & paused explorations',
      icon: 'gazette',
      badge: 'Gazette',
      url: '/antechamber/reserve.html',
      keywords: 'reserve gazette broadsheet archive prototype dormant on hold vault teardown chronos buffer'
    },
    {
      group: 'Sound & Atelier Bench',
      title: 'Behind the Curtain',
      sub: 'Making tedious tasks effortless & the craft of disassembly',
      icon: 'manifesto',
      badge: 'Manifesto',
      url: '/antechamber/about.html',
      keywords: 'behind curtain atelier workshop philosophy manifesto'
    },

    // Quick Studio Actions
    {
      group: 'Atelier Actions',
      title: 'Toggle Light / Dark Palette',
      sub: 'Switch between Studio Dark and Warm Paper color palettes',
      icon: 'theme',
      badge: 'Theme',
      action: 'toggle-theme',
      keywords: 'theme dark light mode color'
    },
    {
      group: 'Atelier Actions',
      title: 'Copy Email Address',
      sub: 'Copy ncgimenez@proton.me directly to clipboard',
      icon: 'mail',
      badge: 'Clipboard',
      action: 'copy-email',
      keywords: 'email contact message copy address'
    },
    {
      group: 'Atelier Actions',
      title: 'Exit to Portfolio',
      sub: 'Return to professional engineering work, ERP systems & case studies',
      icon: 'user',
      badge: 'Portfolio ↗',
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
      icon: 'timer',
      badge: 'Live PWA ↗',
      url: 'https://ncgimenez.github.io/span-focus/',
      external: true,
      keywords: 'span focus timer pomodoro pwa app react live'
    },
    {
      group: 'Live Software',
      title: 'Launch Span Plan',
      sub: 'Daily calendar buffer & automatic task rollover board',
      icon: 'calendar',
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
      icon: 'train',
      badge: 'Interactive',
      url: '/projects/mobile-UX.html#sncb-simulator',
      keywords: 'sncb train transit platform doors stairs simulation'
    },
    {
      group: 'Interactive Prototypes',
      title: 'Google Calendar Selection Box',
      sub: 'Test the desktop marquee drag-to-select sandbox',
      icon: 'marquee',
      badge: 'Interactive',
      url: '/projects/google-calendar.html#calendar-sandbox',
      keywords: 'calendar google marquee select drag batch interaction'
    },
    {
      group: 'Interactive Prototypes',
      title: 'Hardware Teardown Sandbox',
      sub: 'Unscrew 4 pentalobe screws to pry open the smartphone battery compartment',
      icon: 'tool',
      badge: 'Interactive',
      url: '/blog/disassembly.html#teardown-sandbox',
      keywords: 'teardown disassembly hardware screw battery iphone repair'
    },

    // Systems & Case Studies
    {
      group: 'Systems Case Studies',
      title: 'The Span Suite: Planning Without Overwhelm',
      sub: 'Two-tier product architecture & real-world dogfooding log',
      icon: 'layers',
      badge: 'Case Study',
      url: '/projects/span-suite.html',
      keywords: 'span case study product design architecture dogfooding'
    },
    {
      group: 'Systems Case Studies',
      title: 'SNCB Mobile: Fixing the 4-Minute Connection Panic',
      sub: 'Spatial platform translation, carriage doors, and station wayfinding',
      icon: 'train',
      badge: 'Case Study',
      url: '/projects/mobile-UX.html',
      keywords: 'sncb mobile ux case study transit train app'
    },
    {
      group: 'Systems Case Studies',
      title: 'SAP S/4HANA: O2C Without Chaos',
      sub: 'Eliminating rogue spreadsheets & standardising SAP condition contracts',
      icon: 'server',
      badge: 'SAP ERP',
      url: '/projects/sap-o2c-standardization.html',
      keywords: 'sap s4hana erp sd pricing o2c order cash'
    },
    {
      group: 'Systems Case Studies',
      title: 'Odoo ERP: Three Disconnected Tools, One Coherent Flow',
      sub: 'Atomic inventory locking across sales, warehouse, and finance',
      icon: 'package',
      badge: 'Odoo ERP',
      url: '/projects/odoo-inventory.html',
      keywords: 'odoo erp inventory stock warehouse accounting'
    },
    {
      group: 'Systems Case Studies',
      title: 'Pedagogical System Design',
      sub: 'Structured curriculum sequencing and clear milestone progression',
      icon: 'network',
      badge: 'Case Study',
      url: '/projects/pedagogical-system-design.html',
      keywords: 'pedagogical learning curriculum design system case study'
    },

    // Quick Actions
    {
      group: 'Quick Actions',
      title: 'The Atelier & Darkroom',
      sub: 'Photographic studies, Web Audio synthesizer & personal notes',
      icon: 'key',
      badge: 'Atelier',
      url: '/antechamber/',
      keywords: 'atelier studio antechamber darkroom audio lens secret'
    },
    {
      group: 'Quick Actions',
      title: 'Copy Email Address',
      sub: 'Copy ncgimenez@proton.me directly to your clipboard',
      icon: 'mail',
      badge: 'Clipboard',
      action: 'copy-email',
      keywords: 'email contact message copy address'
    },
    {
      group: 'Quick Actions',
      title: 'Toggle Dark / Light Theme',
      sub: 'Switch between Studio Dark and Warm Paper color palettes',
      icon: 'theme',
      badge: 'Theme',
      action: 'toggle-theme',
      keywords: 'theme dark light mode color'
    },
    {
      group: 'Quick Actions',
      title: 'About Nadia',
      sub: 'Background, transition from ERP architecture to product design',
      icon: 'user',
      badge: 'About',
      url: '/about.html',
      keywords: 'about nadia bio background profile cv'
    },
    {
      group: 'Quick Actions',
      title: 'Visit GitHub Profile',
      sub: 'Explore open-source repositories and code (github.com/ncgimenez)',
      icon: 'github',
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
    toast.textContent = 'Email copied to clipboard!';
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
        <div class="cmd-palette-footer-keys">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
        </div>
        <div class="cmd-palette-footer-keys">
          <span><kbd>ESC</kbd> Close</span>
        </div>
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
      const itemRow = e.target.closest('.cmd-palette-row');
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
        groupHeader.className = 'cmd-palette-section-title';
        groupHeader.textContent = item.group;
        listContainer.appendChild(groupHeader);
      }

      const itemRow = document.createElement('div');
      itemRow.className = `cmd-palette-row ${index === selectedIndex ? 'is-active' : ''}`;
      itemRow.dataset.index = index;
      itemRow.setAttribute('role', 'option');
      itemRow.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');

      const iconSvg = ICONS[item.icon] || ICONS.layers;

      itemRow.innerHTML = `
        <div class="cmd-palette-row-left">
          <span class="cmd-palette-icon">${iconSvg}</span>
          <div class="cmd-palette-text">
            <div class="cmd-palette-title">${escapeHtml(item.title)}</div>
            <div class="cmd-palette-sub">${escapeHtml(item.sub)}</div>
          </div>
        </div>
        ${item.badge ? `<span class="cmd-palette-badge">${escapeHtml(item.badge)}</span>` : ''}
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
    const rows = listContainer.querySelectorAll('.cmd-palette-row');
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

    if (typeof window.playMechanicalClick === 'function') {
      window.playMechanicalClick();
    }

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
          showToast(`Email copied: ${email}`);
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
