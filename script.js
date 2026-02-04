/* =========================================================
   Helpers
========================================================= */
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("[data-section]"));

function getHeaderOffset() {
  return (header ? header.offsetHeight : 74) + 10; // buffer for nicer feel
}

function setActive(id) {
  if (!id) return;
  navLinks.forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("is-active", href === `#${id}`);
  });
}

/* =========================================================
   Mobile nav toggle
========================================================= */
function closeNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function openNav() {
  if (!nav || !navToggle) return;
  nav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.contains("is-open");
    open ? closeNav() : openNav();
  });

  // Close on link click (mobile)
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeNav());
  });

  // Close if you tap outside nav (mobile)
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    const clickedInside = nav.contains(e.target) || navToggle.contains(e.target);
    if (!clickedInside) closeNav();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

/* =========================================================
   Active nav highlight (IntersectionObserver - sticky aware)
========================================================= */
let sectionObserver = null;

function initSectionObserver() {
  if (!sections.length) return;

  // Clean up if re-initialized (e.g. on resize)
  if (sectionObserver) sectionObserver.disconnect();

  const offset = getHeaderOffset();

  // We want a section to become "active" once it crosses below the header
  // rootMargin top is negative (pushes the "top" boundary down by header height)
  const options = {
    root: null,
    rootMargin: `-${offset}px 0px -55% 0px`, // bottom margin makes it switch earlier (mid viewport)
    threshold: [0, 0.15, 0.35, 0.6]
  };

  const visibleMap = new Map(); // id -> intersectionRatio

  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (!id) return;

      if (entry.isIntersecting) {
        visibleMap.set(id, entry.intersectionRatio);
      } else {
        visibleMap.delete(id);
      }
    });

    // Choose the section with highest intersection ratio
    // This makes the highlight stable even on large sections
    let bestId = null;
    let bestRatio = 0;

    visibleMap.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    // Fallback: if none intersecting (e.g. at very top), pick first
    if (!bestId) {
      // If user is at top, set Home
      if (window.scrollY < 5) bestId = sections[0].id;
      // If user is near bottom, set last
      else if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 5)) {
        bestId = sections[sections.length - 1].id;
      }
    }

    if (bestId) setActive(bestId);

  }, options);

  sections.forEach(sec => sectionObserver.observe(sec));
}

// If someone clicks a nav link or manually changes hash
window.addEventListener("hashchange", () => {
  const id = (location.hash || "").replace("#", "");
  if (id) setActive(id);
});

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  // initial active based on hash
  const id = (location.hash || "").replace("#", "");
  if (id) setActive(id);
  else if (sections[0]) setActive(sections[0].id);

  initSectionObserver();
});

// Re-init observer on resize (header height changes on breakpoints)
window.addEventListener("resize", () => {
  // small debounce without timers: only re-init after layout settles
  // requestAnimationFrame twice is enough for most cases
  requestAnimationFrame(() => requestAnimationFrame(initSectionObserver));
});

/* =========================================================
   Services segmented tabs
========================================================= */
const segButtons = document.querySelectorAll(".seg-btn");
const panels = document.querySelectorAll(".service-panel");

segButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;

    segButtons.forEach(b => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(p => p.classList.toggle("is-active", p.id === targetId));
  });
});

/* =========================================================
   Custom selects (Contact sentence)
========================================================= */
const selects = document.querySelectorAll("[data-select]");

function closeAllSelects(except = null) {
  selects.forEach(s => {
    if (s !== except) s.classList.remove("is-open");
    const btn = s.querySelector(".select-btn");
    if (btn) btn.setAttribute("aria-expanded", s.classList.contains("is-open") ? "true" : "false");
  });
}

selects.forEach(select => {
  const btn = select.querySelector(".select-btn");
  const valueEl = select.querySelector(".select-value");
  const opts = select.querySelectorAll(".opt");

  if (!btn || !valueEl || !opts.length) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !select.classList.contains("is-open");
    closeAllSelects(isOpen ? select : null);
    select.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  opts.forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      opts.forEach(o => o.classList.remove("is-active"));
      opt.classList.add("is-active");
      valueEl.textContent = opt.textContent.trim();
      select.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
});

document.addEventListener("click", () => closeAllSelects());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllSelects();
});

/* =========================================================
   Footer year
========================================================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   Contact form demo
========================================================= */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form captured (demo). Next step: connect to email/API endpoint.");
    contactForm.reset();
  });
}
