/**
 * sncb-prototype.js - Interactive Transit Context Simulator for SNCB Case Study
 */
(function() {
  const SCENARIOS = {
    same_platform: {
      badge: '🟢 Même Quai Physique (Voie 3 ➔ 4)',
      title: 'Approaching Brussels-Midi · In 3 min',
      trainNo: 'IC 512 (Liège ➔ Bruxelles)',
      trackArr: 'Track 3',
      exitSide: 'DOORS ON LEFT',
      exitSubtext: 'In train direction of travel (➔)',
      trackDep: 'Track 4',
      depTime: '17:42 · Departs in 6 min',
      depDest: 'IC 1938 to Ghent / Bruges',
      bannerClass: 'sncb-banner--green',
      bannerIcon: '🟢',
      bannerTitle: 'MÊME QUAI PHYSIQUE · AUCUN ESCALIER',
      bannerDesc: 'Ne descendez pas dans le passage sous-voie ! Votre correspondance part directement de l’autre côté de ce quai. Traversez simplement la zone centrale (15 secondes).'
    },
    change_platform: {
      badge: '🟠 Changement de Quai (Voie 3 ➔ 8)',
      title: 'Approaching Brussels-Midi · In 3 min',
      trainNo: 'IC 512 (Liège ➔ Bruxelles)',
      trackArr: 'Track 3',
      exitSide: 'DOORS ON RIGHT',
      exitSubtext: 'In train direction of travel (➔)',
      trackDep: 'Track 8',
      depTime: '17:44 · Departs in 8 min',
      depDest: 'IC 2115 to Namur / Luxembourg',
      bannerClass: 'sncb-banner--amber',
      bannerIcon: '🟠',
      bannerTitle: 'CHANGEMENT DE QUAI NÉCESSAIRE',
      bannerDesc: 'Descendez par les escalators centraux vers le couloir Sud. Suivez le fléchage Quai 8 (3 minutes de marche estimée avec bagages).'
    },
    short_platform: {
      badge: '⚠️ Quai Court (Gare d\'Ans)',
      title: 'Approaching Ans · In 2 min',
      trainNo: 'IC 418 (Welkenraedt ➔ Liège)',
      trackArr: 'Track 1',
      exitSide: 'DOORS ON LEFT',
      exitSubtext: 'In train direction of travel (➔)',
      trackDep: 'Exit Destination',
      depTime: 'Arrival 18:05 · Short stop (1 min)',
      depDest: 'Terminus local Ans',
      bannerClass: 'sncb-banner--red',
      bannerIcon: '⚠️',
      bannerTitle: 'ATTENTION : QUAI TROP COURT (GARE D\'ANS)',
      bannerDesc: 'Ce train est plus long que le quai. Les portes des voitures 5 à 8 resteront condamnées. Rejoignez immédiatement les voitures 1 à 4 pour descendre !'
    }
  };

  function initSncbSimulator() {
    const root = document.getElementById('sncb-simulator');
    if (!root) return;

    const btns = root.querySelectorAll('.sncb-scenario-btn');
    const headerTitle = root.querySelector('.sncb-card-title');
    const headerTrain = root.querySelector('.sncb-card-train');
    const trackArrEl = root.querySelector('.sncb-track-arr');
    const exitSideEl = root.querySelector('.sncb-exit-side');
    const exitSubtextEl = root.querySelector('.sncb-exit-subtext');
    const trackDepEl = root.querySelector('.sncb-track-dep');
    const depTimeEl = root.querySelector('.sncb-dep-time');
    const depDestEl = root.querySelector('.sncb-dep-dest');
    const bannerBox = root.querySelector('.sncb-platform-banner');
    const bannerTitle = root.querySelector('.sncb-banner-title');
    const bannerDesc = root.querySelector('.sncb-banner-desc');

    function setScenario(key) {
      const data = SCENARIOS[key];
      if (!data) return;

      btns.forEach(b => {
        const isMatch = b.getAttribute('data-scenario') === key;
        b.classList.toggle('is-active', isMatch);
        b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      // Animate card content transition
      root.querySelector('.sncb-card-body').style.opacity = '0.4';

      setTimeout(() => {
        headerTitle.textContent = data.title;
        headerTrain.textContent = data.trainNo;
        trackArrEl.textContent = data.trackArr;
        exitSideEl.textContent = data.exitSide;
        exitSubtextEl.textContent = data.exitSubtext;
        trackDepEl.textContent = data.trackDep;
        depTimeEl.textContent = data.depTime;
        depDestEl.textContent = data.depDest;

        bannerBox.className = `sncb-platform-banner ${data.bannerClass}`;
        bannerTitle.innerHTML = `${data.bannerIcon} ${data.bannerTitle}`;
        bannerDesc.textContent = data.bannerDesc;

        root.querySelector('.sncb-card-body').style.opacity = '1';
      }, 120);
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        setScenario(btn.getAttribute('data-scenario'));
      });
    });

    setScenario('same_platform');
  }

  // European Rail Double-Chime Synthesizer (Zero-byte audio feedback)
  function playTransitChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Note 1: High tone (D5 ~ 587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.38);

      // Note 2: Resolution tone (A4 ~ 440 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.22);
      gain2.gain.setValueAtTime(0.09, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.68);
    } catch(e) {}
  }

  // Scene 1: Inside Train Cabin / Vestibule Simulator
  function initSncbOnboard() {
    const stage = document.getElementById('sncb-onboard-stage');
    if (!stage) return;

    const btns = stage.querySelectorAll('.sncb-onboard-btn');
    const chimeBtn = stage.querySelector('.sncb-chime-btn');
    const doorLeft = stage.querySelector('#door-left');
    const doorRight = stage.querySelector('#door-right');
    const phoneStation = stage.querySelector('#phone-station-name');
    const phoneDoorText = stage.querySelector('#phone-door-text');
    const phoneDoorSubtext = stage.querySelector('#phone-door-subtext');

    function setSide(side) {
      btns.forEach(b => {
        b.classList.toggle('is-active', b.getAttribute('data-side') === side);
      });

      playTransitChime();

      if (side === 'left') {
        doorLeft.className = 'sncb-train-door sncb-door--left is-active-exit';
        doorRight.className = 'sncb-train-door sncb-door--right is-locked-side';

        const pillL = doorLeft.querySelector('.door-status-pill');
        if (pillL) {
          pillL.textContent = '🟢 SORTIE ICI';
          pillL.style.background = 'rgba(39, 201, 63, 0.2)';
          pillL.style.color = '#27c93f';
          pillL.style.borderColor = '#27c93f';
        }

        const pillR = doorRight.querySelector('.door-status-pill');
        if (pillR) {
          pillR.textContent = '🔒 CONDAMNÉE';
          pillR.style.background = 'rgba(255, 255, 255, 0.05)';
          pillR.style.color = 'var(--texte-muté)';
          pillR.style.borderColor = 'var(--ligne)';
        }

        if (phoneStation) phoneStation.textContent = 'Arrivée Liège-Guillemins (dans 2 min)';
        if (phoneDoorText) phoneDoorText.innerHTML = '<span>⬅️</span><span>PORTES À GAUCHE</span>';
        if (phoneDoorSubtext) phoneDoorSubtext.textContent = 'Dans le sens de marche du train. Vous pouvez déjà vous positionner le long de la porte gauche sans bousculade.';
      } else {
        doorLeft.className = 'sncb-train-door sncb-door--left is-locked-side';
        doorRight.className = 'sncb-train-door sncb-door--right is-active-exit';

        const pillL = doorLeft.querySelector('.door-status-pill');
        if (pillL) {
          pillL.textContent = '🔒 CONDAMNÉE';
          pillL.style.background = 'rgba(255, 255, 255, 0.05)';
          pillL.style.color = 'var(--texte-muté)';
          pillL.style.borderColor = 'var(--ligne)';
        }

        const pillR = doorRight.querySelector('.door-status-pill');
        if (pillR) {
          pillR.textContent = '🟢 SORTIE ICI';
          pillR.style.background = 'rgba(39, 201, 63, 0.2)';
          pillR.style.color = '#27c93f';
          pillR.style.borderColor = '#27c93f';
        }

        if (phoneStation) phoneStation.textContent = 'Arrivée Bruxelles-Midi (dans 3 min)';
        if (phoneDoorText) phoneDoorText.innerHTML = '<span>➡️</span><span>PORTES À DROITE</span>';
        if (phoneDoorSubtext) phoneDoorSubtext.textContent = 'Dans le sens de marche du train. Préparez vos bagages du côté droit du vestibule.';
      }
    }

    btns.forEach(b => {
      b.addEventListener('click', () => setSide(b.getAttribute('data-side')));
    });

    if (chimeBtn) {
      chimeBtn.addEventListener('click', playTransitChime);
    }
  }

  // Scene 2: Platform Cross-Section Simulator
  function initSncbPlatform() {
    const stage = document.getElementById('sncb-platform-stage');
    if (!stage) return;

    const btns = stage.querySelectorAll('.sncb-platform-btn');
    const screenInfo = stage.querySelector('#screen-train-info');
    const pathLabel = stage.querySelector('#platform-path-label');
    const pathLine = stage.querySelector('#platform-path-line');
    const timeEstimate = stage.querySelector('#platform-time-estimate');
    const stairsTitle = stage.querySelector('#stairs-status-title');
    const stairsDesc = stage.querySelector('#stairs-status-desc');
    const stairsBox = stage.querySelector('#platform-stairs-trap');
    const trackRightNum = stage.querySelector('#track-right-number');
    const trackRightDesc = stage.querySelector('#track-right-desc');
    const trackRightStatus = stage.querySelector('#track-right-status');
    const mainBadge = stage.querySelector('#platform-main-badge');

    function setMode(mode) {
      btns.forEach(b => {
        b.classList.toggle('is-active', b.getAttribute('data-mode') === mode);
      });

      playTransitChime();

      if (mode === 'same') {
        // Mode A: Same platform
        if (screenInfo) screenInfo.textContent = 'VOIE 4 ➔ GAND-SAINT-PIERRE · 17:42';
        if (pathLabel) {
          pathLabel.textContent = '➔ Traversée directe à pied (12 mètres)';
          pathLabel.style.color = '#27c93f';
        }
        if (pathLine) {
          pathLine.style.background = '#27c93f';
          pathLine.style.boxShadow = '0 0 10px #27c93f';
          pathLine.style.opacity = '1';
        }
        if (timeEstimate) {
          timeEstimate.innerHTML = '⏱️ 15 secondes · 0 escalier';
          timeEstimate.style.color = '#27c93f';
        }
        if (stairsBox) {
          stairsBox.style.borderColor = '#ff5f56';
          stairsBox.style.background = 'rgba(255, 95, 86, 0.08)';
        }
        if (stairsTitle) {
          stairsTitle.textContent = '🚫 NE PAS DESCENDRE DANS LE SOUTERRAIN !';
          stairsTitle.style.color = '#ff5f56';
        }
        if (stairsDesc) {
          stairsDesc.textContent = 'Les escaliers mènent au couloir souterrain. C’est inutile : votre correspondance part juste de l\'autre côté de ce même quai central.';
        }
        if (trackRightNum) {
          trackRightNum.textContent = 'VOIE 4';
          trackRightNum.style.color = 'var(--accent)';
        }
        if (trackRightDesc) trackRightDesc.textContent = 'Même dalle physique';
        if (trackRightStatus) {
          trackRightStatus.textContent = '🚆 IC 1938 à quai';
          trackRightStatus.style.display = 'block';
        }
        if (mainBadge) {
          mainBadge.className = 'platform-status-badge sncb-banner--green';
          mainBadge.innerHTML = '<span style="font-size: 1.4rem;">🟢</span><div><strong>Zéro escalier :</strong> Le voyageur traverse la dalle en 15 secondes. Il économise 3 minutes et évite de porter ses bagages dans les escaliers.</div>';
        }
      } else if (mode === 'diff') {
        // Mode B: Platform change (Voie 8)
        if (screenInfo) screenInfo.textContent = 'VOIE 8 ➔ LUXEMBOURG · 17:44 (Descendre escaliers)';
        if (pathLabel) {
          pathLabel.textContent = '➔ Descente couloir souterrain vers Quai IV';
          pathLabel.style.color = '#ffbd2e';
        }
        if (pathLine) {
          pathLine.style.background = '#ffbd2e';
          pathLine.style.boxShadow = '0 0 10px #ffbd2e';
          pathLine.style.opacity = '1';
        }
        if (timeEstimate) {
          timeEstimate.innerHTML = '⏱️ 2 min 40s · Escaliers / Ascenseur B';
          timeEstimate.style.color = '#ffbd2e';
        }
        if (stairsBox) {
          stairsBox.style.borderColor = '#ffbd2e';
          stairsBox.style.background = 'rgba(255, 189, 46, 0.12)';
        }
        if (stairsTitle) {
          stairsTitle.textContent = '👇 EMPRUNTER LES ESCALIERS CENTRAUX';
          stairsTitle.style.color = '#ffbd2e';
        }
        if (stairsDesc) {
          stairsDesc.textContent = 'Descendez au couloir Sud puis remontez vers le Quai IV (Voies 7-8). Ascenseur disponible sur votre droite.';
        }
        if (trackRightNum) {
          trackRightNum.textContent = 'VOIE 4';
          trackRightNum.style.color = 'var(--texte-muté)';
        }
        if (trackRightDesc) trackRightDesc.textContent = 'Autre train local';
        if (trackRightStatus) {
          trackRightStatus.textContent = 'L 5082 vers Namur';
          trackRightStatus.style.display = 'block';
        }
        if (mainBadge) {
          mainBadge.className = 'platform-status-badge sncb-banner--amber';
          mainBadge.innerHTML = '<span style="font-size: 1.4rem;">🟠</span><div><strong>Changement guidé :</strong> Le voyageur sait immédiatement qu\'il doit descendre. L\'app affiche le repère de l\'ascenseur le plus proche pour éviter de porter des bagages lourds.</div>';
        }
      } else {
        // Mode C: Commuter panic mistake (without app)
        if (screenInfo) screenInfo.textContent = 'VOIE 4 · Écran invisible depuis le souterrain';
        if (pathLabel) {
          pathLabel.textContent = '⚠️ Erreur : descente panique puis remontée';
          pathLabel.style.color = '#ff5f56';
        }
        if (pathLine) {
          pathLine.style.background = 'repeating-linear-gradient(90deg, #ff5f56 0, #ff5f56 6px, transparent 6px, transparent 12px)';
          pathLine.style.boxShadow = 'none';
        }
        if (timeEstimate) {
          timeEstimate.innerHTML = '⏱️ +3 minutes perdues · Fatigue & Essoufflement';
          timeEstimate.style.color = '#ff5f56';
        }
        if (stairsBox) {
          stairsBox.style.borderColor = '#ff5f56';
          stairsBox.style.background = 'rgba(255, 95, 86, 0.2)';
        }
        if (stairsTitle) {
          stairsTitle.textContent = '⚠️ PIÈGE CLASSIQUE DU VOYAGEUR EN GARE';
          stairsTitle.style.color = '#ff5f56';
        }
        if (stairsDesc) {
          stairsDesc.textContent = 'En voyant "Voie 4", le passager panique, descend en courant dans le tunnel avec sa valise pour regarder le grand tableau d\'affichage, et réalise que son train était juste en haut derrière lui !';
        }
        if (mainBadge) {
          mainBadge.className = 'platform-status-badge sncb-banner--red';
          mainBadge.innerHTML = '<span style="font-size: 1.4rem;">🔴</span><div><strong>Le coût du manque de clarté spatiale :</strong> Des passagers qui courent avec des valises, du stress inutile, et des correspondances ratées alors que le train était à 15 mètres.</div>';
        }
      }
    }

    btns.forEach(b => {
      b.addEventListener('click', () => setMode(b.getAttribute('data-mode')));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSncbSimulator();
      initSncbOnboard();
      initSncbPlatform();
    });
  } else {
    initSncbSimulator();
    initSncbOnboard();
    initSncbPlatform();
  }
})();

