// Glosario — Inglés II · script.js

(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (!finePointer || reduceMotion) return;

    // Warm halo that follows the pointer.
    const glow = document.getElementById('glow');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    const renderGlow = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      glow.style.transform = `translate3d(${currentX - 240}px, ${currentY - 240}px, 0)`;
      rafId = requestAnimationFrame(renderGlow);
    };

    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (rafId === null) rafId = requestAnimationFrame(renderGlow);
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });

    // Seal tilts gently toward the pointer.
    const hero = document.querySelector('.hero');
    const seal = document.getElementById('seal');

    if (hero && seal) {
      let sealFrame = null;
      let rotX = 0;
      let rotY = 0;
      let goalX = 0;
      let goalY = 0;

      const renderSeal = () => {
        rotX += (goalX - rotX) * 0.12;
        rotY += (goalY - rotY) * 0.12;
        seal.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        if (Math.abs(goalX - rotX) > 0.01 || Math.abs(goalY - rotY) > 0.01) {
          sealFrame = requestAnimationFrame(renderSeal);
        } else {
          sealFrame = null;
        }
      };

      hero.addEventListener('pointermove', (event) => {
        const box = seal.getBoundingClientRect();
        const dx = (event.clientX - (box.left + box.width / 2)) / box.width;
        const dy = (event.clientY - (box.top + box.height / 2)) / box.height;
        goalY = Math.max(-7, Math.min(7, dx * 12));
        goalX = Math.max(-7, Math.min(7, -dy * 12));
        if (sealFrame === null) sealFrame = requestAnimationFrame(renderSeal);
      }, { passive: true });

      hero.addEventListener('pointerleave', () => {
        goalX = 0;
        goalY = 0;
        if (sealFrame === null) sealFrame = requestAnimationFrame(renderSeal);
      });
    }

    // Soft spotlight inside each entry.
    document.querySelectorAll('.entry').forEach((entry) => {
      entry.addEventListener('pointermove', (event) => {
        const box = entry.getBoundingClientRect();
        entry.style.setProperty('--mx', `${event.clientX - box.left}px`);
        entry.style.setProperty('--my', `${event.clientY - box.top}px`);
      }, { passive: true });
    });
  })();
