(function () {
  // 1. Initialisation & Persistance du thème
  var savedTheme = localStorage.getItem('ncg-theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;

  // 2. Dictionnaire de traduction Français / Anglais
  const FR = {
    // Navigation générale
    'nav.work': 'Projets',
    'nav.notes': 'Notes',
    'nav.about': 'À propos',
    'nav.lab': 'Lab',
    'nav.behind': 'Coulisses',

    // Hero Index
    'hero.badge': 'Ingénierie Produit & Systèmes',
    'hero.title': 'Je cartographie les logiques complexes, élimine la friction et conçois des interfaces tactiles qui tiennent.',
    'hero.chapo': 'Allier architecture fonctionnelle de systèmes et exécution frontend. De la structuration de flux ERP critiques (SAP S/4HANA & Odoo) à la conception et au déploiement d\'applications web interactives de bout en bout.',
    'hero.cta_apps': 'Explorer les apps live ↗',
    'hero.cta_case': 'Lire l\'étude de cas Span',
    'hero.cta_about': 'À propos',

    // Stats
    'stat.apps': 'Apps Web en ligne',
    'stat.years': 'ans Systèmes ERP',
    'stat.stack': 'Stack Moderne',
    'stat.pwa': 'Tactile & Hors-ligne',

    // Sections Index
    'sec.software.title': 'Logiciels en vedette : La Suite Span',
    'sec.software.link': 'Lire l\'étude complète →',
    'sec.software.chapo': 'Sans cadre d\'opinion, les listes de tâches deviennent anxiogènes. Span sépare la planification macro de l\'exécution unitaire.',
    'sec.systems.title': 'Systèmes d\'Entreprise & Architecture de Processus',
    'sec.systems.chapo': 'Implémentations réelles où la standardisation des flux a résolu des goulots d\'étranglement opérationnels critiques.',
    'sec.notes.title': 'Notes, Teardowns & Démontage',
    'sec.notes.chapo': 'Observations sur les modèles d\'interaction, la friction et l\'analyse de systèmes complexes sous le capot.',

    // Boutons
    'btn.launch': 'Lancer l\'app ↗',
    'btn.deepdive': 'Étude de cas',
    'btn.code': 'Code source',
    'btn.all_notes': 'Voir toutes les notes & écrits →',
    'btn.all_projects': 'Retour aux projets'
  };

  const savedLang = localStorage.getItem('ncg-lang') || 'en';
  const originals = new Map();

  function apply(lang) {
    localStorage.setItem('ncg-lang', lang);
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';

    // Textes simples
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      if (!originals.has(el)) originals.set(el, el.textContent);
      el.textContent = (lang === 'fr' && FR[key]) ? FR[key] : originals.get(el);
    });

    // Blocs HTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.dataset.i18nHtml;
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      el.innerHTML = (lang === 'fr' && FR[key]) ? FR[key] : originals.get(el);
    });

    // État visuel du bouton de langue
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.dataset.active = lang;
    });
  }

  function _isDark() {
    return (document.documentElement.dataset.theme || 'dark') === 'dark';
  }

  function _updateThemeIcons() {
    document.querySelectorAll('.theme-icon').forEach(function (el) {
      el.textContent = _isDark() ? '☀️' : '🌙';
    });
  }

  function setup() {
    // Toggle Langue
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = localStorage.getItem('ncg-lang') || 'en';
        apply(current === 'fr' ? 'en' : 'fr');
      });
    });

    apply(savedLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
