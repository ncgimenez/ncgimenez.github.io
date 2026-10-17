/**
 * cmd-k.js - Command Palette for Nadia Cañadas Giménez Portfolio
 * Keyboard-first navigation (⌘K / Ctrl+K / /)
 */
(function() {
  const COMMANDS = [
    // Live Web Apps
    {
      category: 'Live Apps',
      title: 'Span Focus',
      description: 'Block-based execution timer PWA (React & Supabase)',
      url: 'https://ncgimenez.github.io/span-focus/',
      badge: 'App ↗',
      keywords: 'timer pomodoro pwa react focus execution'
    },
    {
      category: 'Live Apps',
      title: 'Span Plan',
      description: 'Contextual backlog and daily planning web application',
      url: 'https://ncgimenez.github.io/span-plan/',
      badge: 'App ↗',
      keywords: 'plan planning backlog task rollover buffer'
    },

    // Case Studies
    {
      category: 'Case Studies',
      title: 'Span Suite: Planning Without Overwhelm',
      description: 'Dual-engine productivity architecture & product design',
      url: '/projects/span-suite.html',
      badge: 'Case Study',
      keywords: 'span suite case study architecture systems ux'
    },
    {
      category: 'Case Studies',
      title: 'Google Calendar: Marquee Selection',
      description: 'Desktop marquee selection and interaction redesign',
      url: '/projects/google-calendar.html',
      badge: 'UX Concept',
      keywords: 'calendar google teardown interaction marquee schedule'
    },
    {
      category: 'Case Studies',
      title: 'SNCB Mobile UX: Know Which Way to Run',
      description: 'Surfacing platform numbers and exit doors before connecting hubs',
      url: '/projects/mobile-UX.html',
      badge: 'Mobile UX',
      keywords: 'sncb train transit mobile app doors platform ux'
    },
    {
      category: 'Case Studies',
      title: 'SAP S/4HANA: O2C Without Chaos',
      description: 'Standardising SAP SD order management flows for scale-up',
      url: '/projects/sap-o2c-standardization.html',
      badge: 'ERP Systems',
      keywords: 'sap s4hana sd o2c order to cash process erp'
    },
    {
      category: 'Case Studies',
      title: 'Odoo ERP: Three Disconnected Tools, One Coherent Flow',
      description: 'Sales, Inventory, and Accounting unification for Belgian SME',
      url: '/projects/odoo-inventory.html',
      badge: 'ERP Systems',
      keywords: 'odoo erp inventory stock warehouse accounting'
    },
    {
      category: 'Case Studies',
      title: 'Structuring a Language Course That Holds',
      description: 'Instructional design and modular pedagogical architecture',
      url: '/projects/pedagogical-system-design.html',
      badge: 'Architecture',
      keywords: 'pedagogical learning course curriculum instruction'
    },

    // Writings & Notes
    {
      category: 'Writings & Teardowns',
      title: 'Structured Critique of an App',
      description: '3 friction points, 1 solution with clear testable hypotheses',
      url: '/blog/app-critique.html',
      badge: 'Note',
      keywords: 'critique teardown friction metrics hypotheses product'
    },
    {
      category: 'Writings & Teardowns',
      title: 'I Take Things Apart',
      description: 'On phone batteries, Logic Pro, and looking under the surface',
      url: '/blog/disassembly.html',
      badge: 'Mindset',
      keywords: 'disassembly hardware repair logic pro engineering'
    },
    {
      category: 'Writings & Teardowns',
      title: 'Available-to-Promise in Order-to-Cash',
      description: 'The real-world chaos tax of unverified stock commitments',
      url: '/blog/available-to-promise.html',
      badge: 'Systems',
      keywords: 'atp available to promise supply chain inventory'
    },
    {
      category: 'Writings & Teardowns',
      title: 'Focus Sessions Tied to Your Calendar',
      description: 'Connecting the time you plan with the time you protect',
      url: '/blog/focus-sessions.html',
      badge: 'Concept',
      keywords: 'calendar timeblocking focus attention productivity'
    },

    // Navigation & Actions
    {
      category: 'Actions',
      title: 'Toggle Dark / Light Theme',
      description: 'Switch between Studio Slate and Warm Linen palette',
      action: 'toggle-theme',
      badge: 'Action',
      keywords: 'theme mode dark light color'
    },
    {
      category: 'Navigation',
      title: 'Work / All Projects',
      description: 'Explore all software, UX teardowns and enterprise systems',
      url: '/projects/',
      badge: 'Page',
      keywords: 'projects work portfolio apps'
    },
    {
      category: 'Navigation',
      title: 'Notes & Disassembly',
      description: 'Articles, systems thinking essays and teardowns',
      url: '/blog/',
      badge: 'Page',
      keywords: 'blog notes articles writings'
    },
    {
      category: 'Navigation',
      title: 'About Nadia',
      description: 'Background, systems philosophy and experience',
      url: '/about.html',
      badge: 'Page',
      keywords: 'about bio cv experience contact'
    },
    {
      category: 'Navigation',
      title: 'Enter The Antechamber 🗝️',
      description: 'Secret lab and creative exploration space',
      url: '/antechamber/',
      badge: 'Secret',
      keywords: 'antechamber secret lab creative'
    }
  ];

  // Create Modal DOM
  const modal = document.createElement('div');
  modal.id = 'cmd-k-modal';
  modal.className = 'cmd-k-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Command Palette');
  modal.hidden = true;

  modal.innerHTML = `
    <div class="cmd-k-backdrop"></div>
    <div class="cmd-k-box">
      <div class="cmd-k-header">
        <svg class="cmd-k-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="cmd-k-input" class="cmd-k-input" placeholder="Type a command or search project..." autocomplete="off" spellcheck="false" />
        <kbd class="cmd-k-esc-kbd">ESC</kbd>
      </div>
      <div class="cmd-k-results" id="cmd-k-results" role="listbox"></div>
      <div class="cmd-k-footer">
        <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
        <span><kbd>↵</kbd> Select</span>
        <span><kbd>ESC</kbd> Close</span>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const backdrop = modal.querySelector('.cmd-k-backdrop');
  const input = modal.querySelector('#cmd-k-input');
  const resultsContainer = modal.querySelector('#cmd-k-results');
  let selectedIndex = 0;
  let currentResults = [];

  function openPalette() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    renderResults('');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      input.focus();
    });
  }

  function closePalette() {
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = '';
    }, 150);
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    
    if (!q) {
      currentResults = COMMANDS;
    } else {
      currentResults = COMMANDS.filter(cmd => {
        const text = `${cmd.title} ${cmd.description} ${cmd.keywords} ${cmd.category}`.toLowerCase();
        return text.includes(q);
      });
    }

    selectedIndex = 0;

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="cmd-k-empty">
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
          <span style="font-size: 0.85rem; color: var(--texte-muté);">Try searching for "Span", "UX", "SAP", or "Theme"</span>
        </div>
      `;
      return;
    }

    // Group by category
    const grouped = {};
    currentResults.forEach((cmd, idx) => {
      if (!grouped[cmd.category]) grouped[cmd.category] = [];
      grouped[cmd.category].push({ cmd, index: idx });
    });

    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
      html += `<div class="cmd-k-group-title">${category}</div>`;
      for (const item of items) {
        const isSelected = item.index === selectedIndex;
        html += `
          <div class="cmd-k-item ${isSelected ? 'is-selected' : ''}" data-index="${item.index}" role="option" aria-selected="${isSelected}">
            <div class="cmd-k-item-info">
              <div class="cmd-k-item-title">${escapeHtml(item.cmd.title)}</div>
              <div class="cmd-k-item-desc">${escapeHtml(item.cmd.description)}</div>
            </div>
            <span class="cmd-k-badge">${escapeHtml(item.cmd.badge)}</span>
          </div>
        `;
      }
    }

    resultsContainer.innerHTML = html;
    updateSelection();
  }

  function updateSelection() {
    const items = resultsContainer.querySelectorAll('.cmd-k-item');
    items.forEach((item, idx) => {
      const isSelected = idx === selectedIndex;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-selected', isSelected);
      if (isSelected) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function executeItem(cmd) {
    closePalette();
    if (cmd.action === 'toggle-theme') {
      const themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) themeBtn.click();
      return;
    }
    if (cmd.url) {
      if (cmd.url.startsWith('http')) {
        window.open(cmd.url, '_blank', 'noopener');
      } else {
        window.location.href = cmd.url;
      }
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Event Listeners
  input.addEventListener('input', () => renderResults(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        executeItem(currentResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  resultsContainer.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.cmd-k-item');
    if (itemEl) {
      const idx = parseInt(itemEl.dataset.index, 10);
      if (currentResults[idx]) {
        executeItem(currentResults[idx]);
      }
    }
  });

  backdrop.addEventListener('click', closePalette);

  // Global keyboard shortcuts: Cmd+K, Ctrl+K, or pressing "/" outside inputs
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.hidden) openPalette();
      else closePalette();
    } else if (e.key === '/' && modal.hidden) {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        openPalette();
      }
    }
  });

  // Attach to trigger button if present
  document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('cmd-k-trigger');
    if (trigger) {
      trigger.addEventListener('click', openPalette);
    }
  });
  // Also check immediately if already loaded
  const triggerNow = document.getElementById('cmd-k-trigger');
  if (triggerNow) {
    triggerNow.addEventListener('click', openPalette);
  }
})();
