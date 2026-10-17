/**
 * disassembly-prototype.js - Interactive Smartphone Teardown for "I Take Things Apart"
 */
(function() {
  function initDisassembly() {
    const sandbox = document.getElementById('teardown-sandbox');
    if (!sandbox) return;

    const screws = sandbox.querySelectorAll('.teardown-screw');
    const plate = sandbox.querySelector('.teardown-top-plate');
    const statusText = sandbox.querySelector('.teardown-status-text');
    const resetBtn = sandbox.querySelector('.teardown-reset-btn');
    const liftBtn = sandbox.querySelector('.teardown-lift-btn');

    let unscrewedCount = 0;
    const TOTAL_SCREWS = screws.length;

    function playScrewSound() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch(e) {}
    }

    function updateStatus() {
      if (unscrewedCount < TOTAL_SCREWS) {
        statusText.innerHTML = `🪛 <strong>${unscrewedCount}/${TOTAL_SCREWS} pentalobe screws removed.</strong> Click remaining screws to loosen the enclosure.`;
        if (liftBtn) liftBtn.style.display = 'none';
      } else {
        statusText.innerHTML = `🔓 <strong>All 4 screws removed!</strong> The adhesive is loosened. Click the chassis to pry it open.`;
        if (liftBtn) liftBtn.style.display = 'inline-flex';
      }
    }

    screws.forEach(screw => {
      screw.addEventListener('click', (e) => {
        e.stopPropagation();
        if (screw.classList.contains('is-removed')) return;

        playScrewSound();
        screw.classList.add('is-rotating');

        setTimeout(() => {
          screw.classList.remove('is-rotating');
          screw.classList.add('is-removed');
          unscrewedCount++;
          updateStatus();
        }, 220);
      });
    });

    function toggleOpen() {
      if (unscrewedCount < TOTAL_SCREWS) {
        // Shake feedback
        plate.classList.add('is-locked-shake');
        setTimeout(() => plate.classList.remove('is-locked-shake'), 300);
        return;
      }
      playScrewSound();
      plate.classList.toggle('is-opened');
    }

    plate.addEventListener('click', toggleOpen);
    if (liftBtn) liftBtn.addEventListener('click', toggleOpen);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playScrewSound();
        unscrewedCount = 0;
        plate.classList.remove('is-opened');
        screws.forEach(s => s.classList.remove('is-removed', 'is-rotating'));
        updateStatus();
      });
    }

    updateStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDisassembly);
  } else {
    initDisassembly();
  }
})();
