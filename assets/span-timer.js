/**
 * span-timer.js - Mini Interactive Span Focus Timer demo for Case Study
 */
(function() {
  function initMiniTimer() {
    const box = document.getElementById('span-mini-timer');
    if (!box) return;

    const digits = box.querySelector('.span-mini-digits');
    const progressBar = box.querySelector('.span-mini-progress-bar');
    const startBtn = box.querySelector('.span-timer-toggle');
    const resetBtn = box.querySelector('.span-timer-reset');

    const TOTAL_SECONDS = 25 * 60; // 25 mins
    let remainingSeconds = TOTAL_SECONDS;
    let timerId = null;

    function formatTime(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function updateView() {
      digits.textContent = formatTime(remainingSeconds);
      const elapsed = TOTAL_SECONDS - remainingSeconds;
      const pct = (elapsed / TOTAL_SECONDS) * 100;
      progressBar.style.width = `${pct}%`;
    }

    function startTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Resume Sprint ▶';
        startBtn.classList.remove('plein');
        return;
      }

      startBtn.textContent = 'Pause ⏸';
      startBtn.classList.add('plein');

      timerId = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateView();
        } else {
          clearInterval(timerId);
          timerId = null;
          startBtn.textContent = 'Completed! 🎉';
          digits.textContent = '00:00';
          progressBar.style.width = '100%';
        }
      }, 1000);
    }

    function resetTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      remainingSeconds = TOTAL_SECONDS;
      startBtn.textContent = 'Start Focus Block ▶';
      startBtn.classList.add('plein');
      updateView();
    }

    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);

    updateView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMiniTimer);
  } else {
    initMiniTimer();
  }
})();
