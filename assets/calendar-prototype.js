/**
 * calendar-prototype.js - Interactive Marquee Selection Prototype for Google Calendar Redesign
 */
(function() {
  function initCalendarPrototype() {
    const sandbox = document.getElementById('calendar-sandbox');
    if (!sandbox) return;

    const canvas = sandbox.querySelector('.cal-canvas');
    const marqueeBox = sandbox.querySelector('.cal-marquee');
    const statusText = sandbox.querySelector('.cal-status-text');
    const resetBtn = sandbox.querySelector('.cal-reset-btn');
    const events = Array.from(sandbox.querySelectorAll('.cal-event'));

    // Initial positions (top in px)
    const initialPositions = events.map(el => ({
      el,
      top: parseInt(el.style.top, 10),
      duration: parseInt(el.style.height, 10)
    }));

    let isDrawingMarquee = false;
    let isDraggingEvents = false;
    let startX = 0;
    let startY = 0;
    let dragStartOffsetY = 0;
    let selectedEvents = new Set();
    let initialEventTops = new Map();

    function updateStatus() {
      const count = selectedEvents.size;
      if (count === 0) {
        statusText.innerHTML = '💡 <em>Click & drag on empty grid</em> to draw a marquee rectangle.';
      } else {
        statusText.innerHTML = `✅ <strong>${count} event${count > 1 ? 's' : ''} selected</strong>. <em>Now drag any selected event</em> to move them together!`;
      }
    }

    // Canvas Pointer Down -> Start Marquee or Deselect
    canvas.addEventListener('pointerdown', (e) => {
      // If clicking directly on an event, handle event drag or selection
      const eventTarget = e.target.closest('.cal-event');
      if (eventTarget) {
        if (!selectedEvents.has(eventTarget)) {
          // If not in selection and no shift key, select only this event
          if (!e.shiftKey) {
            selectedEvents.clear();
            events.forEach(el => el.classList.remove('is-selected'));
          }
          selectedEvents.add(eventTarget);
          eventTarget.classList.add('is-selected');
        }
        
        // Start dragging selected events
        isDraggingEvents = true;
        dragStartOffsetY = e.clientY;
        initialEventTops.clear();
        selectedEvents.forEach(el => {
          initialEventTops.set(el, parseInt(el.style.top, 10));
        });
        canvas.setPointerCapture(e.pointerId);
        updateStatus();
        return;
      }

      // Clicking empty canvas: clear selection unless shift
      if (!e.shiftKey) {
        selectedEvents.clear();
        events.forEach(el => el.classList.remove('is-selected'));
      }

      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;

      isDrawingMarquee = true;
      marqueeBox.style.left = `${startX}px`;
      marqueeBox.style.top = `${startY}px`;
      marqueeBox.style.width = '0px';
      marqueeBox.style.height = '0px';
      marqueeBox.style.display = 'block';

      canvas.setPointerCapture(e.pointerId);
      updateStatus();
    });

    // Pointer Move
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();

      // Handling Batch Dragging of selected events
      if (isDraggingEvents) {
        const deltaY = e.clientY - dragStartOffsetY;
        // Snap to 15px (representing ~15 min)
        const snappedDeltaY = Math.round(deltaY / 15) * 15;

        selectedEvents.forEach(el => {
          const initTop = initialEventTops.get(el);
          const newTop = Math.max(10, Math.min(320, initTop + snappedDeltaY));
          el.style.top = `${newTop}px`;
        });
        return;
      }

      // Handling Marquee Selection
      if (!isDrawingMarquee) return;

      const currentX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const currentY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      marqueeBox.style.left = `${left}px`;
      marqueeBox.style.top = `${top}px`;
      marqueeBox.style.width = `${width}px`;
      marqueeBox.style.height = `${height}px`;

      // Check collision with event blocks
      const marqueeRect = {
        left,
        right: left + width,
        top,
        bottom: top + height
      };

      events.forEach(evEl => {
        const evTop = parseInt(evEl.style.top, 10);
        const evLeft = evEl.offsetLeft;
        const evWidth = evEl.offsetWidth;
        const evHeight = evEl.offsetHeight;

        const evRect = {
          left: evLeft,
          right: evLeft + evWidth,
          top: evTop,
          bottom: evTop + evHeight
        };

        const intersects = !(
          marqueeRect.right < evRect.left ||
          marqueeRect.left > evRect.right ||
          marqueeRect.bottom < evRect.top ||
          marqueeRect.top > evRect.bottom
        );

        if (intersects) {
          selectedEvents.add(evEl);
          evEl.classList.add('is-selected');
        } else if (!e.shiftKey) {
          selectedEvents.delete(evEl);
          evEl.classList.remove('is-selected');
        }
      });

      updateStatus();
    });

    // Pointer Up
    function stopInteractions() {
      if (isDrawingMarquee) {
        isDrawingMarquee = false;
        marqueeBox.style.display = 'none';
      }
      if (isDraggingEvents) {
        isDraggingEvents = false;
      }
      updateStatus();
    }

    canvas.addEventListener('pointerup', stopInteractions);
    canvas.addEventListener('pointercancel', stopInteractions);

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selectedEvents.clear();
        events.forEach((el, i) => {
          el.classList.remove('is-selected');
          el.style.top = `${initialPositions[i].top}px`;
        });
        updateStatus();
      });
    }

    updateStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendarPrototype);
  } else {
    initCalendarPrototype();
  }
})();
