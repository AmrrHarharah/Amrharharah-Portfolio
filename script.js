/* ══════════════════════════════════════════════════════════════════════
   AMR PORTFOLIO 2026 — script.js
   Full-page snap scroll (4 pages) + Focus blur effects + Smooth menu animations
══════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const TOTAL_PAGES = 4;
  const TRANSITION_MS = 900; // match CSS transition duration

  let current = 0;
  let isAnimating = false;

  const pagesEl = document.getElementById("pages");
  const dots = document.querySelectorAll(".nav-dot");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.getElementById("navToggle");
  const navLinksEl = document.getElementById("navLinks");
  const navMenuBtn = document.getElementById("navMenuBtn");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuCloseBtn = document.getElementById("menuClose");
  const menuItems = document.querySelectorAll(".menu-item");
  const ctaStart = document.getElementById("ctaStart");

  /* ── Go to page ── */
  function goTo(index) {
    if (isAnimating) return;
    if (index < 0 || index >= TOTAL_PAGES) return;
    if (index === current) return;

    isAnimating = true;
    current = index;

    // Translate pages wrapper
    pagesEl.style.transform = `translateY(-${current * 100}vh)`;

    // Update active states
    updateNav();
    activatePage(current);

    setTimeout(() => {
      isAnimating = false;
    }, TRANSITION_MS);
  }

  /* ── Activate page animations ── */
  function activatePage(idx) {
    document.querySelectorAll(".page").forEach((p, i) => {
      if (i === idx) {
        p.classList.add("is-active");
      } else {
        p.classList.remove("is-active");
      }
    });
  }

  /* ── Update nav dots & links ── */
  function updateNav() {
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
    navLinks.forEach((l, i) => {
      l.classList.toggle("active", i === current);
    });
  }

  let menuAnimation = null;

  function openMenu() {
    if (window.innerWidth >= 1024 && menuOverlay) {
      if (menuAnimation) {
        menuAnimation.cancel();
      }
      menuOverlay.classList.add("visible");
      menuOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      menuAnimation = menuOverlay.animate(
        [
          { transform: "translateY(-100%)", opacity: 1 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: 820,
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          fill: "forwards",
        },
      );
      menuAnimation.onfinish = () => {
        menuOverlay.style.transform = "translateY(0)";
        menuOverlay.style.opacity = "1";
        menuAnimation = null;
      };
    } else if (navLinksEl) {
      navLinksEl.classList.toggle("open");
      navToggle.classList.toggle("open");
    }
  }

  function closeMenu() {
    if (menuOverlay && menuOverlay.classList.contains("visible")) {
      if (menuAnimation) {
        menuAnimation.cancel();
      }
      menuAnimation = menuOverlay.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(-100%)", opacity: 1 },
        ],
        {
          duration: 820,
          easing: "cubic-bezier(0.33, 1, 0.68, 1)",
          fill: "forwards",
        },
      );
      menuAnimation.onfinish = () => {
        menuOverlay.classList.remove("visible");
        menuOverlay.style.transform = "translateY(-100%)";
        menuOverlay.style.opacity = "0";
        menuOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
        menuAnimation = null;
      };
    }
  }

  /* ── Wheel event ── */
  let wheelAccum = 0;
  const WHEEL_THRESHOLD = 60;

  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (isAnimating) return;

      wheelAccum += e.deltaY;

      if (wheelAccum > WHEEL_THRESHOLD) {
        goTo(current + 1);
        wheelAccum = 0;
      } else if (wheelAccum < -WHEEL_THRESHOLD) {
        goTo(current - 1);
        wheelAccum = 0;
      }
    },
    { passive: false },
  );

  /* ── Keyboard navigation ── */
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  /* ── Touch / swipe ── */
  let touchStartY = null;
  const SWIPE_THRESHOLD = 50;

  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (touchStartY === null) return;
      const diff = touchStartY - e.changedTouches[0].clientY;

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
      touchStartY = null;
    },
    { passive: true },
  );

  /* ── Nav dots & links click ── */
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.page));
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      goTo(parseInt(link.dataset.page));
      // close mobile menu with animation
      navLinksEl.classList.remove("open");
      navToggle.classList.remove("open");
      closeMenu();
    });
  });

  if (navMenuBtn) {
    navMenuBtn.addEventListener("click", openMenu);
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener("click", closeMenu);
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      goTo(parseInt(item.dataset.page));
      closeMenu();
    });
  });

  /* ── CTA button ── */
  if (ctaStart) {
    ctaStart.addEventListener("click", () => goTo(1));
  }

  /* ── Mobile nav toggle with animations ── */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinksEl.classList.toggle("open");
      navToggle.classList.toggle("open");
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < 1024) {
      closeMenu();
    }
  });

  /* ── Focus/Blur Effect on Hover ── */
  function initFocusBlurEffect() {
    const focusTargets = document.querySelectorAll(
      ".nav-link, .menu-item, .cta-btn, .sk-chip, .soc-item, .pw-card, .proj-image-card",
    );

    focusTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        focusTargets.forEach((t) => {
          if (t !== target) {
            t.style.filter = "blur(9px) opacity(0.5)";
            t.style.transition = "filter 0.3s ease";
          } else {
            t.style.filter = "blur(0) opacity(1)";
            t.style.transition = "filter 0.3s ease";
          }
        });
      });

      target.addEventListener("mouseleave", () => {
        focusTargets.forEach((t) => {
          t.style.filter = "blur(0) opacity(1)";
          t.style.transition = "filter 0.3s ease";
        });
      });
    });
  }

  /* ── Init: activate first page ── */
  activatePage(0);
  initFocusBlurEffect();

  /* ── Expose goTo globally (for inline onclick if needed) ── */
  window.scrollToPage = goTo;

  /* ── Prevent default scroll on body ── */
  document.body.style.overflow = "hidden";
})();
// video 
const video = document.querySelector(".menu-overlay video");
if (video) {
  video.playbackRate = 0.5; // Set to half speed for a slower effect
}
