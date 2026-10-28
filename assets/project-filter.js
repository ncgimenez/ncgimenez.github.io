/**
 * project-filter.js - Interactive filtering & tactile card effects for Nadia's Portfolio
 */
(function() {
  function initFilters() {
    const filterBar = document.getElementById('project-filter-bar');
    if (!filterBar) return;

    const filterBtns = filterBar.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.carte[data-category]');
    const countDisplay = document.getElementById('filter-count');
    const sections = document.querySelectorAll('[data-section-category]');
    const container = document.querySelector('.projects-container');

    function applyFilter(category) {
      let visibleCount = 0;

      // Update button active state
      filterBtns.forEach(btn => {
        const isMatch = btn.getAttribute('data-filter') === category;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      if (container) {
        container.classList.toggle('is-filtered', category !== 'all');
      }

      // Filter cards
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        const cats = cardCat.split(/\s+/);
        const show = (category === 'all' || cats.includes(category));
        
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.classList.remove('is-hidden');
          });
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
          setTimeout(() => {
            if (card.classList.contains('is-hidden')) {
              card.style.display = 'none';
            }
          }, 180);
        }
      });

      // Show/hide section headings if structured by section
      sections.forEach(sec => {
        const secCat = sec.getAttribute('data-section-category') || '';
        const sCats = secCat.split(/\s+/);
        if (category === 'all' || sCats.includes(category)) {
          sec.style.display = '';
        } else {
          sec.style.display = 'none';
        }
      });

      // Update counter
      if (countDisplay) {
        countDisplay.textContent = visibleCount === 1 ? '1 project' : `${visibleCount} projects`;
      }

      // Update URL hash cleanly
      if (category !== 'all') {
        history.replaceState(null, '', `#${category}`);
      } else if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }

    // Attach click handlers to buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof window.playMechanicalClick === 'function') {
          window.playMechanicalClick();
        }
        const cat = btn.getAttribute('data-filter');
        applyFilter(cat);
      });
    });

    // Check initial hash (e.g. #apps, #ux, #systems)
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    const validCategories = ['apps', 'ux', 'systems'];
    if (validCategories.includes(initialHash)) {
      applyFilter(initialHash);
    } else {
      applyFilter('all');
    }
  }

  // Tactile Mouse Spotlight Effect on cards
  function initSpotlight() {
    const cards = document.querySelectorAll('.carte');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFilters();
      initSpotlight();
    });
  } else {
    initFilters();
    initSpotlight();
  }
})();
