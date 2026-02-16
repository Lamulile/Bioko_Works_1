/* =========================================================
   Helpers
========================================================= */
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("[data-section]"));

function getHeaderOffset() {
  return (header ? header.offsetHeight : 74) + 10; // buffer
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

  if (sectionObserver) sectionObserver.disconnect();

  const offset = getHeaderOffset();

  const options = {
    root: null,
    rootMargin: `-${offset}px 0px -55% 0px`,
    threshold: [0, 0.15, 0.35, 0.6]
  };

  const visibleMap = new Map(); // id -> intersectionRatio

  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (!id) return;

      if (entry.isIntersecting) visibleMap.set(id, entry.intersectionRatio);
      else visibleMap.delete(id);
    });

    let bestId = null;
    let bestRatio = 0;

    visibleMap.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    if (!bestId) {
      if (window.scrollY < 5) bestId = sections[0].id;
      else if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 5)) {
        bestId = sections[sections.length - 1].id;
      }
    }

    if (bestId) setActive(bestId);

  }, options);

  sections.forEach(sec => sectionObserver.observe(sec));
}

window.addEventListener("hashchange", () => {
  const id = (location.hash || "").replace("#", "");
  if (id) setActive(id);
});

document.addEventListener("DOMContentLoaded", () => {
  const id = (location.hash || "").replace("#", "");
  if (id) setActive(id);
  else if (sections[0]) setActive(sections[0].id);

  initSectionObserver();
});

window.addEventListener("resize", () => {
  requestAnimationFrame(() => requestAnimationFrame(initSectionObserver));
});

/* =========================================================
   Divisions segmented tabs
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

/* ===========================
   Clients carousel controls
=========================== */
document.querySelectorAll("[data-carousel]").forEach((car) => {
  const track = car.querySelector(".clients-track");
  const prev = car.querySelector(".car-prev");
  const next = car.querySelector(".car-next");
  if (!track || !prev || !next) return;

  function step() {
    // scroll by ~one card width
    const firstCard = track.querySelector(".client-card");
    return firstCard ? firstCard.getBoundingClientRect().width + 18 : 360;
  }

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });
});

// Clients carousel buttons
document.querySelectorAll("[data-carousel]").forEach((shell) => {
  const track = shell.querySelector(".clients-track");
  const prev = shell.querySelector(".car-prev");
  const next = shell.querySelector(".car-next");

  if (!track || !prev || !next) return;

  const scrollByCard = (dir) => {
    const card = track.querySelector(".client-card");
    const amount = card ? card.offsetWidth + 16 : 320; // 16 = gap
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));
});
