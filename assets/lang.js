(function () {

  // 1. Thème (sombre par défaut)
  var savedTheme = localStorage.getItem('ncg-theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;

  // 2. Dictionnaire de traduction Français
  const FR = {
    // --- Navigation générale ---
    'nav.home': 'Accueil',
    'nav.projects': 'Projets',
    'nav.notes': 'Notes',
    'nav.about': 'À propos',

    // --- Page d'accueil : Hero ---
    'hero.label': 'Ingénierie Produit & Systèmes',
    'hero.title': 'Je cartographie les logiques complexes, élimine la friction et conçois des interfaces tactiles qui tiennent.',
    'hero.sub': 'Allier architecture fonctionnelle de systèmes et exécution frontend. De la structuration de flux ERP critiques (SAP S/4HANA & Odoo) à la conception et au déploiement d\'applications web interactives de bout en bout.',
    'hero.cta1': 'Explorer les apps live ↗',
    'hero.cta2': 'Toutes les études de cas',
    'hero.cta3': 'Mon parcours',

    // --- Page d'accueil : Statistiques ---
    'stat.apps': 'Apps Web en ligne',
    'stat.years': 'ans Systèmes ERP',
    'stat.stack': 'Stack moderne',
    'stat.pwa': 'Tactile & Hors-ligne',

    // --- Page d'accueil : Titres de sections ---
    'section.software.title': 'Logiciels en vedette : La Suite Span',
    'section.software.sub': 'Un écosystème modulaire de productivité comblant le fossé entre planification macro et exécution micro.',
    'section.systems.title': 'Systèmes d\'Entreprise & Architecture de Processus',
    'section.systems.sub': 'Implémentations réelles où la standardisation des flux a résolu des goulots d\'étranglement opérationnels critiques.',
    'section.notes.title': 'Notes, Teardowns & Démontage',
    'section.notes.sub': 'Observations sur les modèles d\'interaction, la friction et l\'analyse de systèmes complexes sous le capot.',

    // --- Cartes Software (Span) ---
    'span.focus.tag': 'App Web en direct · PWA',
    'span.focus.desc': 'Minuteur d\'exécution par blocs avec suivi par catégorie, raccourcis clavier, gestes tactiles et progression quotidienne en temps réel.',
    'span.plan.tag': 'App Web en direct · Synchronisée',
    'span.plan.desc': 'Backlog contextuel et planification quotidienne conçus pour alimenter directement les sessions de focus sans surcharge cognitive.',
    'btn.launch': 'Lancer l\'application ↗',
    'btn.code': 'Code source',

    // --- Cartes ERP & Teardowns ---
    'card1.label': 'SAP S/4HANA',
    'card1.title': 'O2C sans détour : standardiser SAP SD pour une équipe B2B',
    'card1.desc': 'Cartographier et réparer un processus de commandes défaillant lors d\'une implémentation SAP S/4HANA greenfield pour une scale-up nordique.',

    'card5.label': 'Odoo ERP',
    'card5.title': 'Odoo : trois outils déconnectés, un flux cohérent',
    'card5.desc': 'Implémenter Ventes, Stocks et Comptabilité pour une PME belge pour éliminer les sur-engagements de stock et la réconciliation manuelle.',

    'card3.label': 'Refonte d\'interaction',
    'card3.title': 'Google Agenda : repenser le modèle d\'interaction',
    'card3.desc': 'Glisser pour sélectionner, cliquer pour créer : apporter la sélection rectangulaire standard du bureau à la replanification d\'agenda.',

    'card4.label': 'UX Mobile',
    'card4.title': 'SNCB : savoir où descendre avant d\'arriver',
    'card4.desc': 'Afficher le quai d\'arrivée en temps réel et le côté de sortie des portes avant d\'atteindre les gares de correspondance.',

    'card6.label': 'Architecture Pédagogique',
    'card6.title': 'Structurer un cours de langue qui tient',
    'card6.desc': 'Transformer un savoir tacite en programme modulaire et scalable avec diagnostic de routage et cartographie des prérequis.',

    // --- Cartes Notes & Articles ---
    'note.tools.tag': 'État d\'esprit',
    'note.tools.title': 'Je démonte les objets',
    'note.tools.desc': 'Remplacer des batteries de smartphone, affronter Logic Pro et comprendre pourquoi regarder sous la surface éclaire les flux réels.',

    'note.critique.tag': 'Teardown UX',
    'note.critique.title': 'Critique structurée d\'une application',
    'note.critique.desc': '3 points de friction identifiés, 1 solution argumentée avec hypothèses et métriques d\'impact.',

    'note.atp.tag': 'Logique de Systèmes',
    'note.atp.title': 'Available-to-Promise en Order-to-Cash',
    'note.atp.desc': 'Pourquoi confirmer des engagements sans vérifier le stock réel crée une taxe de chaos non budgétée.',

    'note.focus.tag': 'Concept Produit',
    'note.focus.title': 'Sessions de focus liées à votre calendrier',
    'note.focus.desc': 'Connecter le temps que vous planifiez avec le temps que vous protégez réellement.',

    // --- Pied de page & Liens partagés ---
    'footer.linkedin': 'LinkedIn',
    'link.all_notes': 'Voir toutes les notes & écrits →',
    'link.all_projects': 'Explorer toutes les études de cas →'
  };

  const savedLang = localStorage.getItem('ncg-lang') || 'en';
  const originals = new Map();

  function apply(lang) {
    localStorage.setItem('ncg-lang', lang);
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';

    // Remplacement des textes simples
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      if (!originals.has(el)) originals.set(el, el.textContent);
      el.textContent = (lang === 'fr' && FR[key]) ? FR[key] : originals.get(el);
    });

    // Remplacement des blocs contenant du HTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.dataset.i18nHtml;
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      el.innerHTML = (lang === 'fr' && FR[key]) ? FR[key] : originals.get(el);
    });

    // Mise à jour visuelle du bouton de langue
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.dataset.active = lang;
    });
  }

  function _isDark() {
    var currentTheme = document.documentElement.dataset.theme || 'dark';
    return currentTheme === 'dark';
  }

  function _updateThemeIcons() {
    document.querySelectorAll('.theme-icon').forEach(function (el) {
      el.textContent = _isDark() ? '☀️' : '🌙';
    });
  }

  function setup() {
    // Écouteur pour le changement de langue
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = localStorage.getItem('ncg-lang') || 'en';
        apply(current === 'fr' ? 'en' : 'fr');
      });
    });

    // Écouteur pour le basculement de thème
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newTheme = _isDark() ? 'light' : 'dark';
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('ncg-theme', newTheme);
        _updateThemeIcons();
      });
    });

    _updateThemeIcons();
    apply(savedLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
