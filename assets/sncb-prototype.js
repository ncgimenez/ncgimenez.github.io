/**
 * sncb-prototype.js - Interactive Transit Context Simulator for SNCB Case Study
 */
(function() {
  const SCENARIOS = {
    same_platform: {
      badge: 'Same Physical Platform (Tracks 3 ➔ 4)',
      title: 'Approaching Brussels-Midi · In 3 min',
      trainNo: 'IC 512 (Liège ➔ Brussels)',
      trackArr: 'Track 3',
      exitSide: 'DOORS ON LEFT',
      exitSubtext: 'In train direction of travel (➔)',
      trackDep: 'Track 4',
      depTime: '17:42 · Departs in 6 min',
      depDest: 'IC 1938 to Ghent / Bruges',
      bannerClass: 'sncb-banner--green',
      bannerTitle: 'SAME PHYSICAL PLATFORM · NO STAIRS NEEDED',
      bannerDesc: 'Do not go down into the underpass! Your connection departs directly from the other side of this same platform. Simply cross the central slab (15 seconds).'
    },
    change_platform: {
      badge: 'Platform Change (Tracks 3 ➔ 8)',
      title: 'Approaching Brussels-Midi · In 3 min',
      trainNo: 'IC 512 (Liège ➔ Brussels)',
      trackArr: 'Track 3',
      exitSide: 'DOORS ON RIGHT',
      exitSubtext: 'In train direction of travel (➔)',
      trackDep: 'Track 8',
      depTime: '17:44 · Departs in 8 min',
      depDest: 'IC 2115 to Namur / Luxembourg',
      bannerClass: 'sncb-banner--amber',
      bannerTitle: 'PLATFORM CHANGE REQUIRED',
      bannerDesc: 'Take the central escalators down to the South underpass. Follow signs for Platform IV (Tracks 7–8). Approx. 3 minutes walking time with bags.'
    },
    short_platform: {
      badge: 'Short Platform Warning (Ans)',
      title: 'Approaching Ans · In 2 min',
      trainNo: 'IC 418 (Welkenraedt ➔ Liège)',
      trackArr: 'Track 1',
      exitSide: 'DOORS ON LEFT',
      exitSubtext: 'In train direction of travel (➔)',
      trackDep: 'Exit Destination',
      depTime: 'Arrival 18:05 · Short stop (1 min)',
      depDest: 'Local stop Ans',
      bannerClass: 'sncb-banner--red',
      bannerTitle: 'SHORT PLATFORM WARNING (GARE D\'ANS)',
      bannerDesc: 'This train is longer than the station platform. Doors in cars 5 to 8 will remain locked. Move forward immediately to cars 1 to 4 to disembark!'
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
        bannerTitle.textContent = data.bannerTitle;
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
          pillL.textContent = 'EXIT HERE';
          pillL.style.background = 'rgba(39, 201, 63, 0.2)';
          pillL.style.color = '#27c93f';
          pillL.style.borderColor = '#27c93f';
        }

        const pillR = doorRight.querySelector('.door-status-pill');
        if (pillR) {
          pillR.textContent = 'LOCKED';
          pillR.style.background = 'rgba(255, 255, 255, 0.05)';
          pillR.style.color = 'var(--texte-muté)';
          pillR.style.borderColor = 'var(--ligne)';
        }

        if (phoneStation) phoneStation.textContent = 'Approaching Liège-Guillemins (in 2 min)';
        if (phoneDoorText) phoneDoorText.innerHTML = '<span>DOORS ON LEFT</span>';
        if (phoneDoorSubtext) phoneDoorSubtext.textContent = 'In train direction of travel. You can line up calmly at the left doors before the train halts.';
      } else {
        doorLeft.className = 'sncb-train-door sncb-door--left is-locked-side';
        doorRight.className = 'sncb-train-door sncb-door--right is-active-exit';

        const pillL = doorLeft.querySelector('.door-status-pill');
        if (pillL) {
          pillL.textContent = 'LOCKED';
          pillL.style.background = 'rgba(255, 255, 255, 0.05)';
          pillL.style.color = 'var(--texte-muté)';
          pillL.style.borderColor = 'var(--ligne)';
        }

        const pillR = doorRight.querySelector('.door-status-pill');
        if (pillR) {
          pillR.textContent = 'EXIT HERE';
          pillR.style.background = 'rgba(39, 201, 63, 0.2)';
          pillR.style.color = '#27c93f';
          pillR.style.borderColor = '#27c93f';
        }

        if (phoneStation) phoneStation.textContent = 'Approaching Brussels-Midi (in 3 min)';
        if (phoneDoorText) phoneDoorText.innerHTML = '<span>DOORS ON RIGHT</span>';
        if (phoneDoorSubtext) phoneDoorSubtext.textContent = 'In train direction of travel. Prepare your bags on the right side of the vestibule.';
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
        if (screenInfo) screenInfo.textContent = 'TRACK 4 ➔ GHENT / BRUGES · 17:42';
        if (pathLabel) {
          pathLabel.textContent = '➔ Direct walk across platform (12 meters)';
          pathLabel.style.color = '#27c93f';
        }
        if (pathLine) {
          pathLine.style.background = '#27c93f';
          pathLine.style.boxShadow = '0 0 10px #27c93f';
          pathLine.style.opacity = '1';
        }
        if (timeEstimate) {
          timeEstimate.innerHTML = '15 seconds · 0 stairs';
          timeEstimate.style.color = '#27c93f';
        }
        if (stairsBox) {
          stairsBox.style.borderColor = '#ff5f56';
          stairsBox.style.background = 'rgba(255, 95, 86, 0.08)';
        }
        if (stairsTitle) {
          stairsTitle.textContent = 'DO NOT TAKE THE STAIRS';
          stairsTitle.style.color = '#ff5f56';
        }
        if (stairsDesc) {
          stairsDesc.textContent = 'These stairs lead down to the underground tunnel. It is completely unnecessary: your connecting train departs right across this same central platform.';
        }
        if (trackRightNum) {
          trackRightNum.textContent = 'TRACK 4';
          trackRightNum.style.color = 'var(--accent)';
        }
        if (trackRightDesc) trackRightDesc.textContent = 'Same physical concrete slab';
        if (trackRightStatus) {
          trackRightStatus.textContent = 'IC 1938 at platform';
          trackRightStatus.style.display = 'block';
        }
        if (mainBadge) {
          mainBadge.className = 'platform-status-badge sncb-banner--green';
          mainBadge.innerHTML = '<div><strong>Zero stairs needed:</strong> The passenger walks across the slab in 15 seconds, saving 3 minutes and avoiding carrying heavy bags down and up stairs.</div>';
        }
      } else if (mode === 'diff') {
        // Mode B: Platform change (Track 8)
        if (screenInfo) screenInfo.textContent = 'TRACK 8 ➔ LUXEMBOURG · 17:44 (Take stairs down)';
        if (pathLabel) {
          pathLabel.textContent = '➔ Walk down to underpass tunnel toward Platform IV';
          pathLabel.style.color = '#ffbd2e';
        }
        if (pathLine) {
          pathLine.style.background = '#ffbd2e';
          pathLine.style.boxShadow = '0 0 10px #ffbd2e';
          pathLine.style.opacity = '1';
        }
        if (timeEstimate) {
          timeEstimate.innerHTML = '2 min 40s · Stairs / Elevator B';
          timeEstimate.style.color = '#ffbd2e';
        }
        if (stairsBox) {
          stairsBox.style.borderColor = '#ffbd2e';
          stairsBox.style.background = 'rgba(255, 189, 46, 0.12)';
        }
        if (stairsTitle) {
          stairsTitle.textContent = 'TAKE THE CENTRAL STAIRS / ELEVATOR';
          stairsTitle.style.color = '#ffbd2e';
        }
        if (stairsDesc) {
          stairsDesc.textContent = 'Head down to the South underpass and walk toward Platform IV (Tracks 7–8). Elevator available on your right.';
        }
        if (trackRightNum) {
          trackRightNum.textContent = 'TRACK 4';
          trackRightNum.style.color = 'var(--texte-muté)';
        }
        if (trackRightDesc) trackRightDesc.textContent = 'Other local train';
        if (trackRightStatus) {
          trackRightStatus.textContent = 'L 5082 to Namur';
          trackRightStatus.style.display = 'block';
        }
        if (mainBadge) {
          mainBadge.className = 'platform-status-badge sncb-banner--amber';
          mainBadge.innerHTML = '<div><strong>Guided platform transfer:</strong> The commuter knows immediately to go down. The app highlights the nearest elevator to avoid carrying heavy luggage down stairs.</div>';
        }
      } else {
        // Mode C: Commuter panic mistake (without app)
        if (screenInfo) screenInfo.textContent = 'TRACK 4 · Display invisible from underground tunnel';
        if (pathLabel) {
          pathLabel.textContent = 'Mistake: Panic stairs sprint down, then back up';
          pathLabel.style.color = '#ff5f56';
        }
        if (pathLine) {
          pathLine.style.background = 'repeating-linear-gradient(90deg, #ff5f56 0, #ff5f56 6px, transparent 6px, transparent 12px)';
          pathLine.style.boxShadow = 'none';
        }
        if (timeEstimate) {
          timeEstimate.innerHTML = '+3 minutes lost · Fatigue &amp; Stress';
          timeEstimate.style.color = '#ff5f56';
        }
        if (stairsBox) {
          stairsBox.style.borderColor = '#ff5f56';
          stairsBox.style.background = 'rgba(255, 95, 86, 0.2)';
        }
        if (stairsTitle) {
          stairsTitle.textContent = 'CLASSIC TRANSIT STATION TRAP';
          stairsTitle.style.color = '#ff5f56';
        }
        if (stairsDesc) {
          stairsDesc.textContent = 'Seeing "Track 4", the commuter panics, sprints down into the underpass with their suitcase to check the big departures board, only to realize their train was right upstairs behind them!';
        }
        if (mainBadge) {
          mainBadge.className = 'platform-status-badge sncb-banner--red';
          mainBadge.innerHTML = '<div><strong>The cost of missing spatial context:</strong> Running with heavy bags, unnecessary panic, and missed connections even though the train was 15 meters away.</div>';
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

